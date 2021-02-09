import React, { useState, Fragment } from 'react';
import Dropzone from 'react-dropzone'
import uuid from 'react-uuid'
import axios from 'axios';




import ImgPreview from './ImgPreview/ImgPreview';
import classes from './UploadForm.module.css';

import { useHttpClient } from './http-hook';


const imageMaxSize = 1000000000; // bytes

function  UploadForm(props) {

    const [files, setFiles] = useState([]);

    const getUploadIcon = () => {
        return(
            <svg className={classes.uploadIcon} width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="cloud_upload_24px">
                <path id="icon/file/cloud_upload_24px" fillRule="evenodd" clipRule="evenodd" d="M97.1533 50.2C93.7533 32.95 78.6033 20 60.4033 20C45.9533 20 33.4033 28.2 27.1533 40.2C12.1033 41.8 0.40332 54.55 0.40332 70C0.40332 86.55 13.8533 100 30.4033 100H95.4033C109.203 100 120.403 88.8 120.403 75C120.403 61.8 110.153 51.1 97.1533 50.2ZM95.4033 90H30.4033C19.3533 90 10.4033 81.05 10.4033 70C10.4033 59.75 18.0533 51.2 28.2033 50.15L33.5533 49.6L36.0533 44.85C40.8033 35.7 50.1033 30 60.4033 30C73.5033 30 84.8033 39.3 87.3533 52.15L88.8533 59.65L96.5033 60.2C104.303 60.7 110.403 67.25 110.403 75C110.403 83.25 103.653 90 95.4033 90ZM53.1534 65H40.4034L60.4034 45L80.4034 65H67.6534V80H53.1534V65Z" fill="#001628" fillOpacity="0.7"/>
                </g>
            </svg>
        )
    }


    const deleteImage = (id) => {
        const filesNew = files.filter(f => f.id !== id);
        setFiles(filesNew);
    }


    const handleOnDrop = async (acceptedFiles, rejectedFiles) => {
        if(acceptedFiles && acceptedFiles.length > 0){
            const arrFiles = Array.from(acceptedFiles)
            const newFiles = arrFiles.map((file) => {
                const src = window.URL.createObjectURL(file)
                return { file, id: uuid(), src }
            })
            setFiles(files.concat(newFiles));
        }
    }

    //checking if the 
    const checkValid = () => {
        return files && files.length > 0 
    }


    const onStartUpload = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        if(token){
            let ids = [];
            let imgsNew = files;
            for(let i=0; i<files.length; i++){
                const url = 'http://localhost:5000/api/drop';
                const formData = new FormData();
                formData.append('file', files[i].file);
                formData.append('source', '');
                const headers = { headers: { 'authorization' : `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                axios.post(url, formData, headers)
                .then(res => {
                    console.log('////////////////////////////')
                    console.log(res.body);
                })
                .catch((err) => {
                    console.log('############################')
                    console.log(err);
                }) 
            }
        }
    }

    console.log(props.user);

    return(
        <main>
            <h1>Bulc upload</h1>
            <form className={classes.uploadForm}>
                <div className={classes.Previews}>
                        {
                            files.length > 0 ? 
                            files.map((img) => (
                                <ImgPreview src={img.src} key={img.id} remove={() => deleteImage(img.id)}/>
                            )) : null
                        }
                </div>
                <Dropzone 
                    onDrop={handleOnDrop}
                    maxSize={imageMaxSize}
                    accept='image/*'>
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <section className={classes.Dropzone}>
                                <div className={classes.ZoneText}> 
                                    {getUploadIcon()}
                                    { 
                                        files.length === 0 ? 
                                            <span className={classes.ChooseFile}>Choose image files </span>
                                        :   <span className={classes.ChooseFile}>Choose more images </span>
                                    }
                                    <span>or drag them here</span>
                                </div>
                            </section>
                        </div>
                    )}
                </Dropzone>
                <div className={classes.ButtonContainer}>
                <button onClick={onStartUpload} disabled={!checkValid()}> 
                                    UPLOAD
                </button>
                </div>
            </form>
        </main >
    )
}

export default UploadForm;