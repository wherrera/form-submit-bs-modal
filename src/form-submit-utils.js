
function _get_data_attributes (attributes) {
    let data_items = []
      $(attributes).each(function() {
        if(!this.nodeName.startsWith('data-bs') && this.nodeName.startsWith('data-')) {
          let key = this.nodeName.substring(5).split('-').join('_');
          data_items.push( {'key': key, 'value': this.nodeValue});
        }
      });
      return data_items;
}

function form_submit_bs_modal(options)
{
  let _alert = alert;
  if(options && options.error && typeof options.error === 'function') {
      _alert = options.error;
  }
  let modal = this;
  let submit_button = modal.find(`button[type="submit"]`);
    if(submit_button) {
      submit_button.click(function() {
        modal.find('form').submit();
      });
    }
    else {
      _alert(`cant find 'submit' button`);
    }
    function _hide_loading() {
      modal.find('div[name="loading"]').hide();
      modal.find('div[name="body"]').show();
    }
    function _show_loading() {
      modal.find('div[name="loading"]').show();
      modal.find('div[name="body"]').hide();
    }
    modal.on('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var objectId = button.getAttribute('data-bs-id');
        _show_loading();
        let form = modal.find('form');
        let data_items = _get_data_attributes(button.attributes);
        data_items.forEach(item => {
          let form_field = form.find(`input[name="${item.key}"]`);
          if(form_field) {
            form_field.val(item.value);
          } else {
            console.warn(`cant find form input for ${item.key}`);
          }
        });        
        let form_action = modal.find('form').attr('action');
        let form_method = modal.find('form').attr('method');
        if(form_method == null || form_method.toUpperCase() == "POST") {
          _hide_loading();
          return;
        }
        $.ajax({
            method: "GET",
            url: form_action,
            data: { 
                "id": objectId
            }
        }).done(function( msg ) {
            modal.find('div[name="loading"]').hide();
            modal.find('div[name="body"]').show();
            Object.keys(msg).forEach(key => {
                var _data = msg[key];
                var _input = modal.find('[name="' + key + '"]');
                if(_input && _data)
                {
                  switch(_input.prop("tagName")) {
                    case "INPUT": _input.val(_data); break;
                    case "SELECT":
                      let items = _data;
                      if(!Array.isArray(items)) {
                        items = [items];
                      }
                      items.forEach(item => {
                          let _id = item.id ? item.id : item;
                          let _text = item.text ? item.text : item;
                          if ($(_input).find("option[value='" + _id + "']").length) {
                          } else {                              
                              $(_input).append(new Option(_text, _id, true, true)).trigger('change');
                          }
                      });
                      $(_input).val(items).trigger('change');
                      break;
                  }
                }
            });
        }).fail(function(data) {
            let response = data.responseJSON;
            if(response != undefined && response.message) {
                _alert(response.message);
            } else {
                _alert("internal server error.");
            }
        });
    });
    modal.find("form").submit(function(e) {
        e.preventDefault();
        modal.find('div[name="loading"]').show();
        modal.find('div[name="body"]').hide();
        let form = modal.find("form");
        var form_data = form.serialize();
        let form_action = form.attr('action');
        let form_method = modal.find('form').attr('method');
        $.ajax({
            url: form_action,
            method: form_method,              
            data: form_data
        })
        .done(function(data, textStatus) {
            let response = data.responseJSON;
            if(response != undefined && response.message) {
                alert(response.message);
            }
            location.reload();
        })
        .fail(function(data) {
            let response = data.responseJSON;
            if(response != undefined && response.message) {
                _alert(response.message);
            } else {
                _alert("internal server error.");
            }
            modal.find('div[name="loading"]').hide();
            modal.find('div[name="body"]').show();
        });
    });
}
if (typeof module === "object" && typeof module.exports === "object") {
    modulal.exports = {
        form_submit_bs_modal
    }
}
if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    (function( $ ) {
        $.fn.form_submit_bs_modal = form_submit_bs_modal;
    }( jQuery ));
}