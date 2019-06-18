import styled from 'styled-components';

export default styled.div`
  white-space: nowrap;
  text-align: center;
  display: ${({ fullWidth }) => (fullWidth ? 'block' : 'inline-block')};
  ${({ size }) => size === 'large' && `min-width: 200px`};
  ${({ size }) => size === 'small' && `min-width: 150px`};

  button {
    width: 100%;
    padding: 0 20px 0 20px;

    ${({ type }) =>
      (!type || type === 'primary') &&
      `background-image: linear-gradient(135.78deg, #002590 0%, #1388b7 50.87%, #56c4c6 100%);`}

    ${({ type }) => type === 'danger' && ` background-color: #cc0000;`}

    border-radius: 50px;
    height: 48px;
    color: white;
    box-shadow: none;
    border: 0;

    &:focus {
      outline: none;
    }
  }

  .buttonIcon {
    margin-right: 10px;
  }
`;
