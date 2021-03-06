import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { isMobile } from "../../utils";

import icon01 from "./img/icon-01.png";
import mobileIcon from "./img/mobile-icon.png";
import closeIcon from "./img/close-icon.png";

const cx = classNames.bind(styles);

const MobileModal = () => {
  const [visible, setVisible] = useState(false);

  const handleClickClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    isMobile() && setVisible(true);
  }, []);

  return (
    <Modal
      visible={visible}
      footer={null}
      closeIcon={<img alt="..." src={closeIcon} style={{ width: "40px" }} />}
      onCancel={handleClickClose}
    >
      <div className={cx("mobile-main")}>
        <img alt="..." src={mobileIcon} className={cx("banner-logo")} />
        <div className={cx("banner-content")}>
          <h5 className={cx("title")}>
            <span role="img" aria-label="fire">
              🔥
            </span>{" "}
            We are launching our Parachain Crowdloan on Polkadot.
          </h5>
          <p className={cx("desc")}>
            Contribute your DOT to help build a Web3.0 Bridge Hub by joining our crowdloan, unlock RING and KTON bonus,
            also BTC and Metaverse limited edition commemorative NFT waiting for you.
          </p>
        </div>
        <Link className={cx("banner-link")} to="plo">
          <span>Join our crowdloan</span>
        </Link>
      </div>
    </Modal>
  );
};

const PloBanner = () => {
  return (
    <>
      <MobileModal className={cx("mobile-modal")} />
      <Container>
        <div className={cx("main")}>
          <img alt="..." src={icon01} className={cx("banner-logo")} />
          <div className={cx("banner-content")}>
            <h5 className={cx("title")}>The Second Batch of Polkadot Parachain Auction has ended.</h5>
            <p className={cx("desc")}>
              Thank you for supporting Darwinia Network! Do not contribute any more DOT at this time. Metaverse NFT
              Package rewards can be claimed now!
            </p>
          </div>
          <Link className={cx("banner-link")} to="plo">
            <span>Crowdloan Details</span>
          </Link>
        </div>
      </Container>
    </>
  );
};

export default React.memo(PloBanner);
