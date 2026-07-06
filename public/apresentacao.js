document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    // Inicializando o FullCalendar
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: async function(info, successCallback, failureCallback) {
            try {
                // Buscando dados do JSON-Server
                const response = await fetch('http://localhost:3000/eventos');
                const eventos = await response.json();
                
                // Mapeando os dados da API para o formato do FullCalendar
                const eventosFormatados = eventos.map(evento => {
                    // Definindo cores baseadas no tipo de evento
                    let color = '#3788d8';
                    if (evento.type === 'workshop') color = '#28a745';
                    else if (evento.type === 'conferencia') color = '#dc3545';
                    else if (evento.type === 'meetup') color = '#ffc107';
                    
                    // Tratando a data final (FullCalendar end date is exclusive)
                    let endDate = new Date(evento.end);
                    endDate.setDate(endDate.getDate() + 1);

                    return {
                        id: evento.id,
                        title: evento.title,
                        start: evento.start,
                        end: endDate.toISOString().split('T')[0],
                        color: color,
                        extendedProps: {
                            type: evento.type,
                            location: evento.location
                        }
                    };
                });
                
                successCallback(eventosFormatados);
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
                failureCallback(error);
            }
        },
        eventClick: function(info) {
            alert('Evento: ' + info.event.title + '\n' +
                  'Tipo: ' + info.event.extendedProps.type + '\n' +
                  'Local: ' + info.event.extendedProps.location);
        }
    });

    calendar.render();
});
