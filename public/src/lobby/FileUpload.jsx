import React, { useState } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register the plugins
registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  return (
    <fieldset className='fieldset'>
      <legend className='legend'>Upload Custom Set</legend>
      <FilePond
        allowRevert={false}
        maxFileSize={"3MB"}
        acceptedFileTypes={["application/json"]}
        files={files}
        server="/api/sets/upload"
        onupdatefiles={fileItems => {
          // Set currently active file objects to this.state
          setFiles(fileItems.map(fileItem => fileItem.file));
        }}
      />
    </fieldset>
  );
};

export default FileUpload;
