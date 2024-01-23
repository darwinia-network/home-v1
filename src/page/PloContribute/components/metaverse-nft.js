import React, { useState } from "react";
import classNames from "classnames/bind";
import { Tooltip, Modal, Spin, message } from "antd";
import Web3Utils from "web3-utils";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import acceptIcon from "../img/accept.svg";
import acceptedIcon from "../img/accepted.svg";
import infoIcon from "../img/info-icon.png";
import modalCloseIcon from "../img/modal-close.png";

import { useApi } from "../hooks";
import { DOT_PRECISION } from "../utils";
import styles from "../styles.module.scss";

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";

const GET_MY_ADDRESS_REMARKS = gql`
  query RemarkedNftAddresses($signer: String!) {
    claimRemarks(limit: 10, where: {signer_eq: $signer}) {
      value
    }
  }
`;

const excludedList = ["13wNbioJt44NKrcQ5ZUrshJqP7TKzQbzZt5nhkeL4joa3PAX"];

const cx = classNames.bind(styles);

const isAnValidDarwiniaAddress = (address) => {
  return Web3Utils.isAddress(address || "");
};

const MetaverseNFT = ({ myTotalContribute, currentAccount }) => {
  const { api } = useApi();
  const [isRemarked, setIsRemarked] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [visibleModalCopyThat, setVisibleModalCopyThat] = useState(false);
  const [visibleModalClaimNFT, setVisibleModalClaimNFT] = useState(false);
  const [nftDarwiniaAddress, setNftDarwiniaAddress] = useState("");

  const { loading, error, data } = useQuery(GET_MY_ADDRESS_REMARKS, {
    variables: { signer: currentAccount ? u8aToHex(decodeAddress(currentAccount.address)) : '' },
  });
  error && console.error(error);
  const myRemarked =
    !loading && !error && data && data.claimRemarks && data.claimRemarks.length
      ? data.claimRemarks[0]
      : null;

  const handleClickAcceptAndClaim = async () => {
    setClaimLoading(true);

    try {
      const injector = await web3FromAddress(currentAccount.address);
      api.setSigner(injector.signer);

      message.info("Please sign and send the transaction in Polkadot extension");

      const mark = `NFT amount: 1; Rewards receiving address: ${nftDarwiniaAddress}`;
      const unsubscribe = await api.tx.system.remark(mark).signAndSend(currentAccount.address, async (result) => {
        if (!result || !result.status) {
          return;
        }
        message.info("Extrinsic processing");

        if (result.status.isFinalized || result.status.isInBlock) {
          unsubscribe();

          result.events
            .filter(({ event: { section } }) => section === "system")
            .forEach((res) => {
              const {
                event: { method },
              } = res;

              if (method === "ExtrinsicFailed") {
                message.error("Extrinsic failed");
              } else if (method === "ExtrinsicSuccess") {
                message.success("Extrinsic success");
                setIsRemarked(true);
                setClaimLoading(false);
                setVisibleModalClaimNFT(false);
                setVisibleModalCopyThat(true);
              }
            });
        }

        if (result.isError) {
          setClaimLoading(false);
          message.error("Extrinsic Failed");
        }
      });
    } catch (err) {
      console.error(err);
      setClaimLoading(false);
      message.error("Extrinsic Failed");
    }
  };

  const isExcluded = excludedList.find((v) => currentAccount && v === currentAccount.address);

  return (
    <>
      <div className={cx("contribute-info-item")}>
        <div className={cx("contribute-info-item-title-wrap")}>
          <span className={cx("contribute-info-item-title")}>Metaverse NFT Package</span>
          <Tooltip
            overlayClassName="tooltip-overlay"
            overlayInnerStyle={{ padding: "20px", paddingBottom: "10px" }}
            color="white"
            placement="rightTop"
            trigger={["click", "hover"]}
            title={
              <p className={cx("tips")}>
                You can get an{" "}
                <a target="_blank" rel="noopener noreferrer" href="https://www.evolution.land/">
                  Evolution Land
                </a>{" "}
                Metaverse NFT Package when your contribution share greater or equal 10 DOT and you will have a chance to
                get a limited edition commemorative NFT in the Package.
                <br />
                <br />
                The Metaverse NFT Package will be awarded after the Polkadot Slot Auction is terminated regardless of
                whether Darwinia Network wins the slot auction or not.
              </p>
            }
          >
            <img alt="..." src={infoIcon} className={cx("info-icon")} />
          </Tooltip>
        </div>
        <div className={cx("current-tag", "space")}>
          <span>Current</span>
        </div>
        <span className={cx("contribute-info-item-value")}>
          {myTotalContribute.gte(DOT_PRECISION.muln(10)) && !isExcluded ? "1" : "0"}
        </span>
        {isRemarked || myRemarked ? (
          <Tooltip
            overlayClassName="tooltip-overlay"
            overlayInnerStyle={{ padding: "20px", paddingBottom: "10px" }}
            color="white"
            placement="rightTop"
            trigger={["click", "hover"]}
            title={
              <div>
                <p className={cx("tips")}>
                  <strong>Your address has been recorded!</strong>
                </p>
                <p className={cx("tips")}>
                  NFT will be distributed after 2 rounds of Evolution Land Columbus Continent sales end.
                </p>
                <p className={cx("tips")}>
                  Please track the NFT rewards by switching to{" "}
                  <a target="_blank" rel="noopener noreferrer" href="https://www.evolution.land/lands">
                    Columbus Continent
                  </a>{" "}
                  of Evolution Land, or stay tuned on our official Twitter.
                </p>
                <p className={cx("tips")}>
                  Please feel free to contact us through "
                  <a target="_blank" rel="noopener noreferrer" href="mailto:hello@darwinia.network">
                    hello@darwinia.network
                  </a>
                  " if you have any questions.
                </p>
              </div>
            }
          >
            <button className={cx("claim-reward-btn", "disabled")}>
              <span className={cx("claim-reward-btn-text")}>Claimed</span>
            </button>
          </Tooltip>
        ) : (
          <button
            className={cx("claim-reward-btn")}
            disabled={myTotalContribute.lt(DOT_PRECISION.muln(10)) || loading || !currentAccount || isExcluded}
            onClick={() => setVisibleModalClaimNFT(true)}
          >
            <Spin wrapperClassName={cx("metaverse-nft-modal-ok-btn-spin")} spinning={loading}>
              <span className={cx("claim-reward-btn-text")}>Claim</span>
            </Spin>
          </button>
        )}
      </div>

      <Modal
        visible={visibleModalCopyThat}
        title={null}
        footer={null}
        onCancel={() => setVisibleModalCopyThat(false)}
        closeIcon={<img alt="..." src={modalCloseIcon} />}
        className={cx("metaverse-nft-modal")}
      >
        <div className={cx("metaverse-nft-modal-body")}>
          <h5 className={cx("metaverse-nft-modal-title")}>Copy that!</h5>
          <ul className={cx("metaverse-nft-modal-content")}>
            <li>Your address has been recorded!</li>
            <li>
              Please track the NFT rewards by switching to Columbus Continent of Evolution Land, or stay tuned on our
              official Twitter.
            </li>
            <li>
              Please feel free to contact us through "
              <a target="_blank" rel="noopener noreferrer" href="mailto:hello@darwinia.network">
                hello@darwinia.network
              </a>
              " if you have any questions.
            </li>
          </ul>
          <button
            className={cx("metaverse-nft-modal-ok-btn", "metaverse-nft-modal-copy-that-ok-btn")}
            onClick={() => setVisibleModalCopyThat(false)}
          >
            <span className={cx("metaverse-nft-modal-ok-btn-text")}>OK</span>
          </button>
        </div>
      </Modal>
      <Modal
        visible={visibleModalClaimNFT}
        title={null}
        footer={null}
        onCancel={() => setVisibleModalClaimNFT(false)}
        closeIcon={<img alt="..." src={modalCloseIcon} />}
        className={cx("metaverse-nft-modal")}
      >
        <div className={cx("metaverse-nft-modal-body")}>
          <h5 className={cx("metaverse-nft-modal-title")}>Claim NFT</h5>
          <ul className={cx("metaverse-nft-modal-content")}>
            <li>The NFT is sent as a reward for your support of Darwinia Network Crowdloan.</li>
            <li>
              You need to fill in the correct Crab Smart Chain receiving address <strong>starts with “0x”</strong>.
            </li>
            <li>
              The reward will be distributed after 2 rounds of Evolution Land{" "}
              <a target="_blank" rel="noopener noreferrer" href="https://www.evolution.land/lands">
                Columbus Continent
              </a>{" "}
              sales end.
            </li>
            <li>
              Please feel free to contact us through "
              <a target="_blank" rel="noopener noreferrer" href="mailto:hello@darwinia.network">
                hello@darwinia.network
              </a>
              " if you have any questions.
            </li>
          </ul>
          <div className={cx("metaverse-nft-modal-accept")}>
            <button onClick={() => setIsAccepted((prev) => !prev)}>
              <img alt="..." src={isAccepted ? acceptedIcon : acceptIcon} />
            </button>
            <span>I accept and continue to claim</span>
          </div>
          <div className={cx("metaverse-nft-modal-address-input-wrap")}>
            <input
              onChange={(event) => setNftDarwiniaAddress(event.target.value)}
              className={cx("metaverse-nft-modal-address-input")}
              disabled={claimLoading || !isAccepted}
              placeholder="Please enter your receiving address"
            />
            <span
              className={cx("metaverse-nft-modal-address-warning", {
                disabled: !nftDarwiniaAddress || isAnValidDarwiniaAddress(nftDarwiniaAddress),
              })}
            >
              Please fill in the correct receiving address starts with “0x”.{" "}
            </span>
          </div>
          <button
            className={cx("metaverse-nft-modal-ok-btn")}
            disabled={
              claimLoading || !isAccepted || !nftDarwiniaAddress || !isAnValidDarwiniaAddress(nftDarwiniaAddress)
            }
            onClick={handleClickAcceptAndClaim}
          >
            <Spin wrapperClassName={cx("metaverse-nft-modal-ok-btn-spin")} spinning={claimLoading}>
              <span className={cx("metaverse-nft-modal-ok-btn-text")}>I accept and claim</span>
            </Spin>
          </button>
        </div>
      </Modal>
    </>
  );
};

const client = new ApolloClient({
  uri: "https://squid.subsquid.io/darwinia-nft-squid/v/v1/graphql",
  cache: new InMemoryCache(),
});

const MetaverseNFTWrap = (props) => (
  <ApolloProvider client={client}>
    <MetaverseNFT {...props} />
  </ApolloProvider>
);

export default React.memo(MetaverseNFTWrap);
