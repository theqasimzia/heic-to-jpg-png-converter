document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const response = await fetch('/convert', {
      method: 'POST',
      body: formData,
    });
  
    const result = await response.json();
    const output = document.getElementById('output');
  
    if (response.ok) {
      output.innerHTML = '<h2>Conversion Successful!</h2>';
      result.files.forEach(file => {
        const link = document.createElement('a');
        link.href = file;
        link.textContent = file;
        link.download = '';
        output.appendChild(link);
        output.appendChild(document.createElement('br'));
      });
    } else {
      output.textContent = 'Error: ' + result.error;
    }
  });
  