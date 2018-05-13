
class EventManager {
    constructor() {
        this.urlBase = "/events"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
            this.inicializarCalendario(response)
        })
    }

    eliminarEvento(evento) {
        let eventId = evento.id
        let url = this.urlBase + "/delete"
        $.post(url, {id: eventId}, (response) => {
            alert(response)
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let nombre = $('#titulo').val(),
            start = $('#start_date').val(),
            title = $('#titulo').val(),
            end = '',
            start_hour = '',
            end_hour = '';

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            let url = this.urlBase + "/new"
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                }
                $.post(url, ev, (response) => {
                    alert(response)
                })
                $('.calendario').fullCalendar('renderEvent', ev)
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        var fecha = new Date();
        var mes = parseInt(fecha.getMonth()) + 1;
        var dia = parseInt(fecha.getDate());
        if(mes < 10){
          mes = "0" + (parseInt(fecha.getMonth())+1);
        }
        if(dia < 10){
          dia = "0" + parseInt(fecha.getDate());
        }
        var hoy = fecha.getFullYear() + '-' + mes + '-' + dia;
        var options = {
          header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month,agendaWeek,basicDay'
          },
          defaultDate: hoy,
          navLinks: true,
          editable: true,
          eventLimit: true,
          droppable: true,
          dragRevertDuration: 0,
          timeFormat: 'H:mm',
          eventDrop: (event) => {
              this.actualizarEvento(event)
          },
          events: [],
          eventDragStart: (event,jsEvent) => {
              $('.delete').find('img').attr('src', "../img/trash-open.png");
              $('.delete').css('background-color', '#a70f19')
          },
          eventDragStop: (event,jsEvent) => {
              var trashEl = $('.delete');
              var ofs = trashEl.offset();
              var x1 = ofs.left;
              var x2 = ofs.left + trashEl.outerWidth(true);
              var y1 = ofs.top;
              var y2 = ofs.top + trashEl.outerHeight(true);
              if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                  jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                      this.eliminarEvento(event)
                      $('.calendario').fullCalendar('removeEvents', event.id);
              }
          }
        };
        for(let i=0; i < eventos.length; i++){
          var datos = [];
          datos['id'] = eventos[i]['_id'];
          datos['title'] = eventos[i]['titulo'];
          if(eventos[i]['hora_inicio']!=null){
            datos['start'] = eventos[i]['fecha_inicio'] + ' ' + eventos[i]['hora_inicio'].substring(0, 5);
          }else{
            datos['start'] = eventos[i]['fecha_inicio'];
          }
          datos['end'] = eventos[i]['fecha_final'];
          options.events.push(datos);
        }
        $('.calendario').fullCalendar(options);
    }
    actualizarEvento(evento) {
      let id = evento._id,
          start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'),
          end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'),
          form_data = new FormData(),
          start_date,
          end_date,
          start_hour,
          end_hour

      start_date = start.substr(0,10)
      end_date = end.substr(0,10)
      start_hour = start.substr(11,8)
      end_hour = end.substr(11,8)

      let ev = {
        id: id,
        start: start_date,
        start_hour:start_hour,
        end: end_date,
        end_hour: end_hour
      }
      $.post('/events/update', ev, function(data) {
          alert(data);
      });
    }
}

const Manager = new EventManager()
