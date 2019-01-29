import React, { Component } from "react";

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadStatus: false
        };
        this.handleUploadImage = this.handleUploadImage.bind(this);
    }


    handleUploadImage(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.append("file", this.uploadInput.files[0]);
        fetch("/api/sets/upload", {
            method: "POST",
            body: data
        })
        .then(response => {
            response.json().then(console.log)
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleUploadImage}>
                    <div>
                        <input accept=".json" ref={(ref) => { this.uploadInput = ref; }} type="file" />
                    </div>
                    <button type>Upload</button>

                </form>
            </div>
        )
    }
}

export default FileUpload;