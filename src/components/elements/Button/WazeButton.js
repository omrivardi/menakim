import React from 'react';
import styled from 'styled-components';

export default function SocialButton({ type, link, children, className }) {
  return (
    <Button href={link} target="_blank" rel="noreferrer noopener" $type={type} className={className}>
      <ImageContainer>
        <Icon src={`/icons/waze32x32.svg`} alt={type} />
      </ImageContainer>
      <Divider />
      <Text>{children}</Text>
    </Button>
  );
}

export const Button = styled.a`
  width: 284px;
  height: 32px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  opacity: 0.7;
  background-color: #ffffff;
  width: 1px;
  height: 100%;
  margin-left: 20px;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 19px;
`;

const ImageContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
