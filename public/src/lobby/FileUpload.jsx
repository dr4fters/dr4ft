import React, { Component } from "react";

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadStatus: false,
            fileName: "Import custom set"
        };
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    onChangeFile({ target }) {
        const data = new FormData();
        data.append("file", target.files[0]);
        fetch("/api/sets/upload", {
            method: "POST",
            body: data
        })
            .then(response => {
                if (/^2/.exec(response.status)) {
                    this.setState({
                        fileName: "Upload completed!"
                    });
                } else {
                    this.setState({
                        fileName: "Upload error: " + response.statusText
                    });
                }
            })
            .catch(error => {
                this.setState({
                    fileName: "Upload error: " + error.statusText
                });
            });

        this.setState({
            fileName: target.value.split('\\').pop()
        })
    }

    render() {
        return (
            <div style={{"display": "inline"}}>
                <input type="file" name="file" onChange={this.onChangeFile} id="file" className="inputfile" accept=".json" />
                <label for="file">{this.state.fileName}</label>
            </div>
        )
    }
}

export default FileUpload;