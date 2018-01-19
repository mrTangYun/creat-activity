import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider, DatePicker, message } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import EditActivity from './editActivity';
import ShowActivity from './showActivity';

moment.locale('zh-cn');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: ''
    };
  }
  handleChange(date) {
    message.info('您选择的日期是: ' + date.toString());
    this.setState({ date });
  }
  saveDataHandler = data => {
    this.setState({
        data: JSON.stringify(data)
    });
  };
  render() {
    const testData = '{"pages":[[{"url":"https://wx-res.youbtrip.com/7490f380b0589ca67cd484312a7ccc3a.png","coords":[{"dots":[{"x":0.5017064846416383,"y":0.4665391969407266},{"x":0.7508532423208191,"y":0.655831739961759},{"x":0.49146757679180886,"y":0.6845124282982792},{"x":0.28668941979522183,"y":0.5640535372848948},{"x":0.2901023890784983,"y":0.47609942638623326}],"action":{"type":"close"}},{"dots":[{"x":0.17064846416382254,"y":0.18738049713193117},{"x":0.06143344709897611,"y":0.3154875717017208},{"x":0.17064846416382254,"y":0.4646271510516252},{"x":0.5392491467576792,"y":0.3881453154875717},{"x":0.5392491467576792,"y":0.2294455066921606}],"action":{"type":"getCoupon","data":{"afterGetCoupon":{"type":"nothing"}}}},{"dots":[{"x":0.764505119453925,"y":0.10707456978967496},{"x":0.8907849829351536,"y":0.28489483747609945},{"x":0.7952218430034129,"y":0.3690248565965583},{"x":0.6313993174061433,"y":0.24091778202676864},{"x":0.552901023890785,"y":0.12237093690248566}],"action":{"type":"redirect","data":{"title":"实名认证","wx":{"url":"/ordering/user-certification","redirectType":"inapp"},"app":{"url":"/ordering/user-certification","redirectType":"inapp"}}}}]},{"url":"https://wx-res.youbtrip.com/7490f380b0589ca67cd484312a7ccc3a.png","coords":[{"dots":[{"x":0.6382252559726962,"y":0.4072657743785851},{"x":0.6382252559726962,"y":0.6061185468451242},{"x":0.33447098976109213,"y":0.5678776290630975},{"x":0.3378839590443686,"y":0.42065009560229444}],"action":{"type":"getCoupon","data":{"afterGetCoupon":{"type":"nothing"}}}}]}]]}';
    const pageData = JSON.parse(this.state.data || '{}');
    // const pageData = JSON.parse(this.state.data || testData);
    return (
      <LocaleProvider locale={zhCN}>
        <div style={{ width: 700, margin: 'auto' }}>
          <EditActivity saveData={this.saveDataHandler} />
            {
                this.state.data && (
                    <div style={{ width: 300, margin: 'auto' }}>
                      <ShowActivity pageData={pageData} />
                    </div>
                )
            }

        </div>
      </LocaleProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));