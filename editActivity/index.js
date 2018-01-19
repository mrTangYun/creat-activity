import React from 'react';
import PageEdit from './pageEdit';
import './index.css';
import { Upload, message, Button, Icon, Radio, Input} from 'antd';

export default class EditActivity extends React.PureComponent{
    constructor() {
        super();
        this.state = {
            editingPageIndex: 0,
            pages: [],
            tmpPage: {}
        };
    }

    clickAddPageHandler = () => {
        this.setState({
            tmpPage: {},
            editingPageIndex: this.state.editingPageIndex + 1
        });
    };

    addImageHandler = url => {
        this.setState({
            tmpPage: {
                uploadedImages: [...(this.state.tmpPage.uploadedImages || []), url]
            },
        });
    };

    savePageData = () => {
        const data = this.state.tmpPage.uploadedImages.map((url, index) => ({
            url,
            coords: this.imageEdit.state.savedData[index]
        }));
        const pageData = {
            pages: [data]
        };
        this.props.saveData(pageData);
    };

    deleteImgHandler = index => {
        //TODO: 删除的逻辑没做好
        const uploadedImages = [...this.state.tmpPage.uploadedImages];
        uploadedImages.splice(index, 1);
        this.setState({
            tmpPage: {
                uploadedImages: uploadedImages
            }
        });
    };

    componentDidMount() {
        // this.addImageHandler('https://wx-res.youbtrip.com/7490f380b0589ca67cd484312a7ccc3a.png');
    }

    render() {
        return(<div>
            <div>
                <PageEdit
                    data={this.state.tmpPage}
                    addImageHandler={this.addImageHandler}
                    deleteImgHandler={this.deleteImgHandler}
                    ref={node => this.imageEdit = node}
                />
                {
                    this.state.tmpPage && this.state.tmpPage.uploadedImages && this.state.tmpPage.uploadedImages.length > 0 && (
                        <div>
                            <Button
                                onClick={this.savePageData}
                                icon={'save'}>
                                保存
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>);
    }
}
