document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const progressBar = document.getElementById('progress-bar');
    progressBar.value = 0;
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/convert', true);
  
    // Update progress bar
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        progressBar.value = percentComplete;
      }
    };
  
    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        const output = document.getElementById('output');
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
        output.textContent = 'Error: ' + xhr.statusText;
      }
    };
  
    xhr.send(formData);
  });
  