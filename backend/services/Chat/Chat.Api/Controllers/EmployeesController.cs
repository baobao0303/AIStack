using System;
using System.Collections.Generic;
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
    public class EmployeesController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public EmployeesController(ChatDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees([FromQuery] string? status)
        {
            var query = _context.Employees.AsNoTracking();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(e => e.ActiveChatStatus == status);
            }

            return await query.ToListAsync();
        }

        // GET: api/employees/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            return employee;
        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            if (employee.Id == Guid.Empty)
            {
                employee.Id = Guid.NewGuid();
            }

            employee.CreatedAt = DateTimeOffset.UtcNow;

            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // PUT: api/employees/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(Guid id, Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest(new { message = "Mismatched employee ID in request." });
            }

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            existingEmployee.FirstName = employee.FirstName;
            existingEmployee.LastName = employee.LastName;
            existingEmployee.Email = employee.Email;
            existingEmployee.Department = employee.Department;
            existingEmployee.ActiveChatStatus = employee.ActiveChatStatus;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await EmployeeExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound(new { message = $"Employee with ID {id} not found." });
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> EmployeeExists(Guid id)
        {
            return await _context.Employees.AnyAsync(e => e.Id == id);
        }
    }
}
