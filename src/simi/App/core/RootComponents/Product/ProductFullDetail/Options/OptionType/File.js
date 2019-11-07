import React from 'react';
import Abstract from './Abstract';
import Identify from 'src/simi/Helper/Identify';
import {showToastMessage} from 'src/simi/Helper/Message';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import {uploadFile} from 'src/simi/Model/Product'

class File extends Abstract {

    constructor(props){
        super(props);
        this.uploadingId = null
    }

    render(){
        const notes = []
        const ObjOptions = this.props.data
        if (!ObjOptions.input_name)
            return ''

        if (ObjOptions.file_extension)
            notes.push(
                <p className="note" key="file_extension">
                    {Identify.__('Compatible file extensions to upload:')} {ObjOptions.file_extension}
                </p>
            )
        
        if (ObjOptions.image_size_x && parseInt(ObjOptions.image_size_x))
            notes.push(
                <p className="note" key="image_size_x">
                    {Identify.__(`Maximum image width: %@px`).replace('%@', ObjOptions.image_size_x)}
                </p>
            )
        
        if (ObjOptions.image_size_y && parseInt(ObjOptions.image_size_y))
            notes.push(
                <p className="note" key="image_size_y">
                    {Identify.__(`Maximum image height: %@px`).replace('%@', ObjOptions.image_size_y)}
                </p>
            )
            
        return (
            <div>
                <input name={ObjOptions.input_name} 
                        id={this.props.id} 
                        parent={this} 
                        type="file"
                        onChange={() => this.selectedFile(this.props.id)}
                        accept={`.${ObjOptions.file_extension}`}
                        style={{marginBottom: 10}}
                        />
                {notes}
            </div>
        )
    }

    uploadReturned = (result) => {
        hideFogLoading()
        if (result && result.uploadfile) {
            this.updateSelected(this.uploadingId, result.uploadfile)
        } else {
            this.deleteSelected(this.uploadingId)
            showToastMessage(Identify.__('Request Failed'))
        }
        this.uploadingId = null
    }

    getBase64(file, cb) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    selectedFile = (id) => {
        if (document.getElementById(id)) {
            this.uploadingId = id
            const input = document.getElementById(id)
            const filePath = input.files[0]
            if (filePath) {
                this.getBase64(filePath, (result) => {
                    if (result) {
                        let base64 = result.split("base64,");
                        base64 = base64[base64.length-1];
                        base64 = base64.split('"');
                        base64 = base64[0];
                        showFogLoading()
                        const fileData = {
                            type: filePath.type,
                            name: filePath.name,
                            size: filePath.size,
                            base64: base64
                        }
                        uploadFile(this.uploadReturned.bind(this), {fileData})
                        return
                    }
                    this.deleteSelected(this.uploadingId)
                    showToastMessage(Identify.__('Cannot read file content'))
                });
            }
            this.deleteSelected(this.uploadingId)
        }
    }
}
export default File;