import React from 'react';
import { Upload, message, Button, Icon, Spin } from 'antd';

export default class UploadBtn extends React.PureComponent{
    state = {
        disabled: false
    };

    handleChange = info => {
        this.setState({
            disabled: info.file.status === 'uploading'
        });
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            this.props.addImageHandler('https://wx-res.youbtrip.com/7490f380b0589ca67cd484312a7ccc3a.png');
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            this.props.addImageHandler('https://wx-res.youbtrip.com/7490f380b0589ca67cd484312a7ccc3a.png');
        }
    };

    render() {
        return(<Upload
            action="//jsonplaceholder.typicode.com/posts/"
            onChange={this.handleChange}
            showUploadList={false}
            disabled={this.state.disabled}
        >
            <Button>
                <Icon type={this.state.disabled ? 'loading' : "upload"}  /> 上传图片
            </Button>
        </Upload>);
    }
}
