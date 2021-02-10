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

  // const allowed = ["application/json", "text/xml"]
  // const label = `Drag & Drop your files here, or <span class="filepond--label-action">Browse</span><br/>
  //   JSON (MTGJSON formatted, v4) and XML (Cockatrice formatted, v3 & v4) are supported.`
  const allowed = ["text/xml"]
  const label = `Drag & Drop your files here, or <span class="filepond--label-action">Browse</span><br/>
    XML (Cockatrice formatted, v3 & v4) is supported.`

  return (
    <fieldset className='fieldset'>
      <legend className='legend'>Upload Custom Set</legend>

      <p>
        <i className="ion ion-android-alert" style={{ fontSize: 20, paddingRight: 5 }} />
        Custom set uploads have been causing crashes.
        While we debug this only XML uploads will be allowed
      </p>

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
