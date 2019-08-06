import React from "react";




class RAMFileUpload extends React.Component {
  state = {
    uploadedFileContents: new Array(16),
    waitingForFileUpload: false
  };

  static readUploadedFileAsText = inputFile => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };

  uploadFile = async event => {
    event.persist();

    if (!event.target || !event.target.files) {
      return;
    }

    this.setState({ waitingForFileUpload: true });

    const fileList = event.target.files;

    // Uploads will push to the file input's `.files` array. Get the last uploaded file.
    const latestUploadedFile = fileList.item(fileList.length - 1);

    try {
      const fileContents = await RAMFileUpload.readUploadedFileAsText(latestUploadedFile);
      let sum = 0;
      var newUploadedFileContents = new Array(1024);
      for(let i=0,j=0,k=0;i<fileContents.length;i++){
        
        if(fileContents[i]=='0' || fileContents[i] == '1'){
          sum = sum + fileContents[i]*Math.pow(2,7-j);
          j++;
          if(j == 8){
            newUploadedFileContents[k] = sum;
            j=0;
            k++;
            sum = 0;
          }
        }
        
      }
      this.setState({
        uploadedFileContents: newUploadedFileContents,
        waitingForFileUpload: false
      });

      this.props.uploadDataFromFile(this.state.uploadedFileContents);
      document.getElementById("fileToLoad").value = null;
    } catch (e) {
      console.log(e);
      this.setState({
        waitingForFileUpload: false
      });
    }
  };

  render() {
    return (
      <div style={{ display: "grid" }}>
        <input type="file" id="fileToLoad" onChange={this.uploadFile} />

      </div>
    );
  }
}


export default RAMFileUpload;