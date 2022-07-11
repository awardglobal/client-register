import React, { Component } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button, Checkbox } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { SectionTitle } from '../Section';

class Signature extends Component {
  state = { imgUrl: null };
  sigPad: any = {};
  clear = () => {
    this.sigPad.clear();
    this.setState({ imgUrl: null });
  };
  confirm = () => {
    this.setState({ imgUrl: this.sigPad.getCanvas().toDataURL('image/png') });
  };
  render() {
    const { imgUrl } = this.state;
    return (
      <div>
        <SectionTitle>信息确认及签名</SectionTitle>
        <Checkbox
          // className=' border-t-4 pt-6 border-blue-600 '
          extra="Please confirm all the information provided is true and correct"
        >
          请确认以上所提供信息是真实和正确的，并且确认提交
        </Checkbox>
        <br />
        <Checkbox
          extra="I agree to terms and conditions"
          className="w-400 mb-4"
          // style={{ width: 400  }}
        >
          我已阅读并同意以上
          <a style={{ color: 'blue' }} href="www.baidu.com">
            条款
          </a>
          。
        </Checkbox>
        {imgUrl ? <img src={imgUrl} className={styles.imgUrl} /> : null}
        <SignaturePad
          canvasProps={{ className: styles.signPad }}
          ref={(ref) => {
            this.sigPad = ref;
          }}
        />

        <div className={styles.signBtn}>
          <Button
            theme="solid"
            type="primary"
            className="rounded-md mr-5"
            onClick={this.confirm}
          >
            确认签名 Confirm
          </Button>
          <Button onClick={this.clear}>重签 Resign</Button>
        </div>
      </div>
    );
  }
}
export default Signature;
