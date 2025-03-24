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

  // TODO: Custom set uploads in JSON format have been causing crashes (#1432) - needs debugging, only allow XML for now
  // const allowed = ["application/json", "text/xml"]
  // const label = `Drag & Drop your files here, or <span class="filepond--label-action">Browse</span><br/>
  //   JSON (MTGJSON formatted, v4) and XML (Cockatrice formatted, v3 & v4) are supported.`
  const allowed = ["text/xml"]
  const label = `Drag & Drop your files here, or <span class="filepond--label-action">Browse</span><br/>
    XML (Cockatrice formatted, v3 & v4) is supported.`

  return (
    <fieldset className='fieldset'>
      <legend className='legend'>Upload Custom Set</legend>
      { allowed.length &&
      <FilePond
        server={{
          process: {
            url: "/api/sets/upload",
            onerror: setErrorMsg
          }
        }}
        allowRevert={false}
        maxFileSize={"3MB"}
        acceptedFileTypes={allowed}
        allowMultiple={true}
        files={files}
        labelIdle={label}
        labelFileProcessingError={errorMsg}
        onupdatefiles={fileItems => {
          // Set currently active file objects to this.state
          setFiles(fileItems.map(fileItem => fileItem.file));
        }}
      />
      }
    </fieldset>
  );
};

export default FileUpload;
