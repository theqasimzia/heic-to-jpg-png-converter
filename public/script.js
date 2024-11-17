document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const progressBar = document.getElementById('progress-bar');
    const status = document.getElementById('status');
    status.innerHTML = 'Converting images...';
  
    const response = await fetch('/convert', {
      method: 'POST',
      body: formData,
    });
  
    if (response.ok) {
      const result = await response.json();
      progressBar.value = 100;
      status.innerHTML = '<span class="tick">✔</span> Conversion complete! Downloading...';
  
      // Automatically download the zip file
      const link = document.createElement('a');
      link.href = result.zipFilePath;
      link.download = 'converted_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      status.textContent = 'Error: ' + response.statusText;
    }
  });
  