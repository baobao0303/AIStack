using System;
using System.Threading.Tasks;

namespace Shared.Messaging
{
    public interface IEventBus
    {
        Task PublishAsync<TEvent>(TEvent @event) where TEvent : class;
        
        void Subscribe<TEvent, THandler>()
            where TEvent : class
            where THandler : IEventHandler<TEvent>;
    }
}
