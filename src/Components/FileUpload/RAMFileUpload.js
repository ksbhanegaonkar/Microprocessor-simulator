import React, { useRef, useCallback } from "react";

const readFileAsText = (inputFile) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => { reader.abort(); reject(new DOMException("Problem parsing input file.")); };
    reader.onload = () => resolve(reader.result);
    reader.readAsText(inputFile);
  });
};

const RAMFileUpload = ({ uploadDataFromFile }) => {
  const inputRef = useRef();

  const handleUpload = useCallback(async (event) => {
    if (!event.target?.files?.length) return;
    const file = event.target.files[event.target.files.length - 1];
    try {
      const fileContents = await readFileAsText(file);
      let sum = 0;
      const data = new Array(1024);
      for (let i = 0, j = 0, k = 0; i < fileContents.length; i++) {
        if (fileContents[i] === '0' || fileContents[i] === '1') {
          sum = sum + Number(fileContents[i]) * Math.pow(2, 7 - j);
          j++;
          if (j === 8) { data[k] = sum; j = 0; k++; sum = 0; }
        }
      }
      uploadDataFromFile(data);
      if (inputRef.current) inputRef.current.value = null;
    } catch (e) {
      console.error(e);
    }
  }, [uploadDataFromFile]);

  return (
    <input ref={inputRef} type="file" className="form-control form-control-sm" onChange={handleUpload} accept=".txt" />
  );
};

export default RAMFileUpload;