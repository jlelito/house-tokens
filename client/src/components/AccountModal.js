import { Box, Flex, Modal, Button, Text, Card, Heading } from 'rimble-ui';
import React, { useState, useEffect } from 'react';

function AccountModal(account) {

    const [isOpen, setIsOpen] = useState(false);
    const [accountModal, setAccount] = useState(null);

    useEffect(() => {
        setAccount(account);
      }, [accountModal]);
  
    const closeModal = e => {
      e.preventDefault();
      setIsOpen(false);
    };
  
    const openModal = e => {
      e.preventDefault();
      setIsOpen(true);
    };
  
    return (
      <Box className='App' p={4}>
        <Box>
          <Button onClick={openModal}>Open Modal</Button>
  
          <Modal isOpen={isOpen}>
            <Card width={'420px'} p={0}>
              <Button.Text
                icononly
                icon={'Close'}
                color={'moon-gray'}
                position={'absolute'}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={closeModal}
              />
  
              <Box p={4} mb={3}>
                <Heading.h3>Confirm Action</Heading.h3>
                <Text>Metamask Account: {accountModal}</Text>
              </Box>
  
              <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={'#E8E8E8'}
                justifyContent={'flex-end'}
              >
                <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                <Button ml={3}>Confirm</Button>
              </Flex>
            </Card>
          </Modal>
        </Box>
      </Box>
    );
}

export default AccountModal