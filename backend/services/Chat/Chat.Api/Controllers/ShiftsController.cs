using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Chat.Api.Entities;
using Chat.Api.Persistence;

namespace Chat.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ShiftsController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public ShiftsController(ChatDbContext context)
        {
            _context = context;
        }

        // GET: api/shifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeShift>>> GetShifts([FromQuery] Guid? employeeId)
        {
            var query = _context.EmployeeShifts.AsNoTracking();

            if (employeeId.HasValue)
            {
                query = query.Where(s => s.EmployeeId == employeeId.Value);
            }

            return await query.ToListAsync();
        }

        // GET: api/shifts/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<EmployeeShift>>> GetActiveShifts()
        {
            var now = DateTimeOffset.UtcNow;
            return await _context.EmployeeShifts
                .AsNoTracking()
                .Where(s => s.ShiftStart <= now && s.ShiftEnd >= now)
                .ToListAsync();
        }

        // GET: api/shifts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeShift>> GetShift(Guid id)
        {
            var shift = await _context.EmployeeShifts.FindAsync(id);

            if (shift == null)
            {
                return NotFound(new { message = $"Shift schedule with ID {id} not found." });
            }

            return shift;
        }

        // POST: api/shifts
        [HttpPost]
        public async Task<ActionResult<EmployeeShift>> CreateShift(EmployeeShift shift)
        {
            // Verify if the referenced employee exists
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == shift.EmployeeId);
            if (!employeeExists)
            {
                return BadRequest(new { message = $"Cannot assign shift. Referenced Employee ID {shift.EmployeeId} does not exist." });
            }

            if (shift.Id == Guid.Empty)
            {
                shift.Id = Guid.NewGuid();
            }

            await _context.EmployeeShifts.AddAsync(shift);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShift), new { id = shift.Id }, shift);
        }

        // PUT: api/shifts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShift(Guid id, EmployeeShift shift)
        {
            if (id != shift.Id)
            {
                return BadRequest(new { message = "Mismatched shift ID in request." });
            }

            var existingShift = await _context.EmployeeShifts.FindAsync(id);
            if (existingShift == null)
            {
                return NotFound(new { message = $"Shift with ID {id} not found." });
            }

            // Verify if the referenced employee exists
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == shift.EmployeeId);
            if (!employeeExists)
            {
                return BadRequest(new { message = $"Cannot assign shift. Referenced Employee ID {shift.EmployeeId} does not exist." });
            }

            existingShift.EmployeeId = shift.EmployeeId;
            existingShift.ShiftStart = shift.ShiftStart;
            existingShift.ShiftEnd = shift.ShiftEnd;
            existingShift.Notes = shift.Notes;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ShiftExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/shifts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShift(Guid id)
        {
            var shift = await _context.EmployeeShifts.FindAsync(id);
            if (shift == null)
            {
                return NotFound(new { message = $"Shift with ID {id} not found." });
            }

            _context.EmployeeShifts.Remove(shift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ShiftExists(Guid id)
        {
            return await _context.EmployeeShifts.AnyAsync(s => s.Id == id);
        }
    }
}
