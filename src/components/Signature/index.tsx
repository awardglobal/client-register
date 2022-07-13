import { Component } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from '@douyinfe/semi-ui';
import styles from './index.module.scss';

interface PropsType {
  onChange?: (value: any) => void;
  errors?: any;
}

class Signature extends Component<PropsType> {
  state = { imgUrl: null };
  sigPad: any = {};
  clear = () => {
    this.sigPad.clear();
    this.setState({ imgUrl: null });
    this.props.onChange?.(null);
  };
  confirm = () => {
    this.sigPad
      .getCanvas()
      .toBlob((b: Blob) => this.props.onChange?.(new File([b], 'sign.png')));

    this.setState({ imgUrl: this.sigPad.getCanvas().toDataURL('image/png') });
  };
  render() {
    const { imgUrl } = this.state;
    return (
      <div>
        {imgUrl && <img src={imgUrl} className={styles.imgUrl} />}
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
        {this.props.errors.signature ? (
          <div className="text-red-500 text-sm font-semibold ">
            请确认信息并签名
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
export default Signature;
