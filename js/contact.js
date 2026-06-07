if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    if (!validateForm()) return;

    const nombre  = fields.nombre.value.trim();
    const email   = fields.email.value.trim();
    const asunto  = fields.asunto.value.trim();
    const mensaje = fields.mensaje.value.trim();

    // Deshabilita el botón mientras envía
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando...';

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('email', email);
      formData.append('asunto', asunto);
      formData.append('mensaje', mensaje);

      const response = await fetch('mail.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.ok) {
        // Muestra éxito
        if (successMsg) successMsg.classList.add('visible');

        // Limpia formulario
        fields.nombre.value  = '';
        fields.email.value   = '';
        fields.asunto.value  = '';
        fields.mensaje.value = '';

        setTimeout(() => {
          if (successMsg) successMsg.classList.remove('visible');
        }, 4000);

      } else {
        alert('Hubo un error al enviar el mensaje. Por favor intentá de nuevo.');
      }

    } catch (error) {
      alert('Hubo un error al enviar el mensaje. Por favor intentá de nuevo.');
    }

    // Restaura el botón
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Enviar mensaje';
  });
}