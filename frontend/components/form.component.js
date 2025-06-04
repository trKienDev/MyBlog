// --* clone 1 form mới thay vì đổi id form ==> tránh việc có 2 form đang cùng tồn tại trên DOM *--
export function cloneResetForm(form_id) {
      const old_form = document.getElementById(form_id);
      const new_form = old_form.cloneNode(true);
      old_form.parentNode.replaceChild(new_form, old_form);
      
      return new_form;
}