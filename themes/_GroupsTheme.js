import styled from 'styled-components';

export default styled.div`
  #groups {
    .group {
      padding: 1.5vh 0;
      margin-bottom: 20px;

      .group-container {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .group-name {
          margin-right: 8px;
        }

        .editGroup {
          cursor: pointer;
        }
      }

      .group-creatives {
        display: flex;
        box-shadow: 0 1px 3px #c9c9c9;
        border-radius: 5px;
        padding: 15px;
        min-height: 25vh;
        flex-wrap: wrap;
        background: white;

        .group-creative {
          display: flex;
          flex-flow: column-reverse;
          position: relative;
          width: 20%;
          min-height: 20vh;
          margin: 15px;
          background-position: 0 0;
          border-radius: 2px;
          background-size: cover;
          cursor: pointer;

          img {
            height: 100%;
            width: 100%;
          }

          .creative-title {
            display: flex;
            color: white;
            justify-content: space-between;
            align-items: flex-end;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.6);

            span {
              max-width: 80%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
        }

        .group-creative-new {
          flex-flow: column;
          background-color: #1b77e1;
          color: white;
          align-items: center;
          justify-content: center;

          .title {
            margin-top: 10px;
          }
        }
      }
    }
  }
`;
