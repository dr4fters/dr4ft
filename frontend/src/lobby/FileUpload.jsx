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
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <fieldset className='fieldset'>
      <legend className='legend'>Upload Custom Set</legend>
      <FilePond
        server={{
          process: {
            url: "/api/sets/upload",
            onerror: setErrorMsg
          }
        }}
        allowRevert={false}
        maxFileSize={"3MB"}
        acceptedFileTypes={["application/json", "text/xml"]}
        allowMultiple={true}
        files={files}
        labelIdle={`Drag & Drop your files here, or <span class="filepond--label-action">Browse</span><br/>
        JSON (MTGJSON formatted, v4) and XML (Cockatrice formatted, v3 & v4) are supported.`}
        labelFileProcessingError={errorMsg}
        onupdatefiles={fileItems => {
          // Set currently active file objects to this.state
          setFiles(fileItems.map(fileItem => fileItem.file));
        }}
      />
    </fieldset>
  );
};

export default FileUpload;
