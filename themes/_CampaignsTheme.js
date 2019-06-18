import styled from 'styled-components';

export default styled.div`
  .campaign-select-container {
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 5px 20px -9px #888888;
    padding: 1% 3%;
    margin: 1.5% 0;
    border-radius: 10px;
    background-color: #fff;
    height: calc(2vh + 40px);

    > div {
      display: flex;
    }

    #campaign-select-info {
      width: 70%;

      .engine-logo {
        display: flex;
        width: 4vw;
        max-width: 40px;
        align-items: center;

        svg {
          width: 100%;

          path {
            fill: black;
          }
        }

        img {
          width: 100%;
        }
      }

      .campaign-name {
        display: flex;
        align-items: center;
        padding: 0;
        margin-left: 35px;
        width: 50%;
      }

      .campaign-status {
        min-width: 200px;
        justify-content: left;
        color: $greyText;
      }
    }

    #campaign-select-buttons {
      > div {
        padding-left: 15px;

        &:first-child {
          display: flex;
          align-items: center;
        }

        &:nth-child(2) {
          display: flex;
          align-items: center;
        }
      }

      .campaign-buttons {
        display: flex;
        position: relative;
        padding: 1% 0;

        button {
          background-image: linear-gradient(135.78deg, #002590 0%, #1388b7 50.87%, #56c4c6 100%);
          border-radius: 5px;
          padding: 10px 35px;
          color: white;
          box-shadow: none;
          border: 0;

          &:focus {
            outline: none;
          }
        }
      }

      .pendingState {
        box-shadow: inset 0 0 0 20px orange, 0 0 0 2px orange;
      }
    }
  }
`;
