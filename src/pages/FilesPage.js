import React, { useState, useEffect } from 'react';

function FilesPage() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const savedFiles = localStorage.getItem('pwa_files');
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const reader = new FileReader();
          reader.onload = (e) => {
            const newFile = {
              id: Date.now(),
              name: file.name,
              type: file.type,
              size: file.size,
              content: e.target.result,
              uploadedAt: new Date().toISOString()
            };
            
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            localStorage.setItem('pwa_files', JSON.stringify(updatedFiles));
          };
          reader.readAsDataURL(file);
          
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    link.click();
  };

  const deleteFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    localStorage.setItem('pwa_files', JSON.stringify(updatedFiles));
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/'));
    if (type.startsWith('text/'));
    if (type.includes('pdf'));
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="files-page">
      <h2>Файловый менеджер</h2>
      
      <div className="files-container">
        <div className="upload-section">
          <h3>Загрузить файл</h3>
          <div className="upload-area">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-label">
              Выберите файл
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="files-list">
          <h3>Мои файлы ({files.length})</h3>
          {files.length === 0 ? (
            <p className="no-data">Файлы не загружены</p>
          ) : (
            <div className="files-grid">
              {files.map(file => (
                <div key={file.id} className="file-card">
                  <div className="file-icon">{getFileIcon(file.type)}</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="file-actions">
                    <button 
                      onClick={() => downloadFile(file)}
                      className="btn btn-primary"
                    >
                      📥
                    </button>
                    <button 
                      onClick={() => deleteFile(file.id)}
                      className="btn btn-danger"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="storage-info">
          <h3>Хранилище</h3>
          <div className="storage-stats">
            <div className="stat">
              <span>Файлов:</span>
              <span>{files.length}</span>
            </div>
            <div className="stat">
              <span>Общий размер:</span>
              <span>{formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilesPage;