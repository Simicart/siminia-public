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
        // if (!ObjOptions.input_name)
        //     return ''

        const { file_value } = ObjOptions;
        let extensionsAllow = '';
        if (file_value.file_extension) {
            notes.push(
                <p className="note" key="file_extension">
                    {Identify.__('Compatible file extensions to upload:')} {file_value.file_extension}
                </p>
            )
            let extArr = file_value.file_extension.split(',');
            extArr = extArr.map(i => '.' + i.trim());
            extensionsAllow = extArr.join(',');
        }
        
        if (file_value.image_size_x && parseInt(file_value.image_size_x))
            notes.push(
                <p className="note" key="image_size_x">
                    {Identify.__(`Maximum image width: %@px`).replace('%@', file_value.image_size_x)}
                </p>
            )
        
        if (file_value.image_size_y && parseInt(file_value.image_size_y))
            notes.push(
                <p className="note" key="image_size_y">
                    {Identify.__(`Maximum image height: %@px`).replace('%@', file_value.image_size_y)}
                </p>
            )
            
        return (
            <div>
                <input name={`custom_file_${this.props.id}`} 
                        id={this.props.id} 
                        parent={this} 
                        type="file"
                        onChange={() => this.selectedFile(this.props.id)}
                        accept={`.${extensionsAllow}`}
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