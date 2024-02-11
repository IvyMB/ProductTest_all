import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const ProductList = ({isLoggedIn}) => {
  const [products, setProducts] = useState([]);
  const [tokenValid, setTokenValid] = useState(false)

  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formError, setFormError] = useState('')

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);

  const loadProducts = async () => {
      // Get all products list
    await axios.get('http://127.0.0.1:8000/api/v1/products/')
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.error('Error on API request:', error);
      });
  }

  const verifyToken = async () => {
      // Checking if the token is valid
      const token = localStorage.getItem('token')
      const data = {"token": token}
      axios.post(`http://127.0.0.1:8000/api/v1/authentication/token/verify/`, data)
       .then(response => {
        setTokenValid(true)
      })
      .catch(error => {
          if (error.response && error.response.status === 401) {
              setTokenValid(false)
          } else {
              console.error('Error on checking the token:', error );
          }
      });
  }

  const handleRefreshToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      const data = {"refresh": refreshToken}

      await axios.post(`http://127.0.0.1:8000/api/v1/authentication/token/refresh/`, data)
       .then(response => {
            const access_token = response.data.access;
            localStorage.setItem('token', access_token)
      })
      .catch(refreshError => {
        console.error('Error on refreshing the token:', refreshError);
      });
  }

  useEffect(  () => {
      // Pré loading the product list data
      loadProducts()
  }, []);

  const openDetailModal = (productId) => {
      // Collecting the selected product data and showing the modal
      setSelectedProductId(productId);
      setShowDetailModal(true);

      const selectedProduct = products.find((product) => product.id === productId);
      // Fill the form fields with product data using ID
      setProductName(selectedProduct.name || '');
      setProductDescription(selectedProduct.description || '');
      setProductPrice(selectedProduct.price || 0);
    }

  const openEditForm = (productId) => {
      // Collecting the selected product data and showing the modal
      setSelectedProductId(productId);
      setShowEditModal(true);

      const selectedProduct = products.find((product) => product.id === productId);
      // Fill the form fields with product data using ID
      setProductName(selectedProduct.name || '');
      setProductDescription(selectedProduct.description || '');
      setProductPrice(selectedProduct.price || 0);
  }

  const openDeleteForm = (productId, productName) => {
      setSelectedProductId(productId);
      setSelectedProductName(productName)
      setShowDeleteModal(true);
  }

  const handleCreateProduct = async () => {
      // Lógica para criar um novo produto
      await verifyToken()
      if (!tokenValid) {
          await handleRefreshToken()
          console.log("Invalid token, refreshing ...")
      }

      if (!productName || !productDescription || !productPrice) {
          setFormError("Please fill all required fields!")
          return
      }
      const token = localStorage.getItem('token')
      const data = {
          "name": productName,
          "description": productDescription,
          "price": productPrice}

      await axios.post(`http://127.0.0.1:8000/api/v1/products/`,
          data,{
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          })
          .then(response => {
              alert(`Product with name ${productName} created successfully!`)
              loadProducts();
              handleCloseCreateModal()
          })
          .catch(error => {
            if (error.response && error.response.data) {
                // Se houver uma resposta e dados de resposta, use-os
                console.error('Erro na resposta da API:', error.response.status, error.response.data);
                setFormError(error.response.data);
            } else if (error.request) {
                console.error('Erro na solicitação (sem resposta):', error.request);
                setFormError('Erro na solicitação (sem resposta)');
            } else {
                // Erro geral
                console.error('Erro durante a execução:', error.message);
                setFormError('Erro durante a execução');
            }
        handleCloseCreateModal()
    });
  };

  const handleEditProduct = async () => {
      // Lógica para editar o produto com o ID `productId`
      console.log(`Editing product ${selectedProductId}`);
      await verifyToken()
      if (!tokenValid) {
          console.log('Invalid token, refreshing ...')
          await handleRefreshToken()
      }

       if (!productName || !productDescription || !productPrice) {
           setFormError("Please fill all required fields!")
           return
      }

      // Validate edit form
      const token = localStorage.getItem('token')
      const data = {
          "name": productName,
          "description": productDescription,
          "price": productPrice}

      await axios.put(`http://127.0.0.1:8000/api/v1/products/${selectedProductId}/`,
          data,{
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          })
          .then(response => {
              alert(`Product with ID ${selectedProductId} updated with success!`)
              loadProducts();
              handleCloseEditModal()
          })

          .catch(error => {
            if (error.response && error.response.data) {
                console.error('Erro na resposta da API:', error.response.status, error.response.data);
                setFormError(error.response.data);
            } else if (error.request) {
                console.error('Erro na solicitação (sem resposta):', error.request);
                setFormError('Erro na solicitação (sem resposta)');
            } else {
                // Erro geral
                console.error('Erro durante a execução:', error.message);
                setFormError('Erro durante a execução');
            }
        handleCloseCreateModal()
    });
  };

  const handleDeleteProduct = async () => {
      console.log(`Delete the product: ${selectedProductName}`);
      await verifyToken()
      if (!tokenValid) {
          await handleRefreshToken()
      }

      const token = localStorage.getItem('token')
      await axios.delete(`http://127.0.0.1:8000/api/v1/products/${selectedProductId}/`,
          {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
          .then(response => {
              alert(`Product: ${selectedProductName} deleted with success!`)
              loadProducts();
        })
          .catch(error => {
            console.error('Error on API get data:', error);
        });
      // Cleaning product selected data and closing the modal
      setShowDeleteModal(false)
      setSelectedProductId(null)
      setSelectedProductName(null)
  };

  const handleCloseDetailModal = () => {
      setShowDetailModal(false);
      setSelectedProductId(null);
      setProductName('');
      setProductDescription('');
      setProductPrice(0);
      setFormError('')
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProductId(null);
    setProductName('');
    setProductDescription('');
    setProductPrice(0);
    setFormError('')
  };

  const handleCloseDeleteModal = () => {
       setShowDeleteModal(false);
       setSelectedProductId(null);
  };

  const handleCloseCreateModal = () => {
      setShowCreateModal(false)
      setProductName('');
      setProductDescription('');
      setProductPrice(0);
      setFormError('')
  }

  return (
    <div>
      <h2>Product list</h2>
        {isLoggedIn && <Button onClick={() => setShowCreateModal(true)}> Create</Button>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
                {isLoggedIn && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
                <td>
                  {isLoggedIn && (
                    <>
                        <button onClick={() => openEditForm(product.id)}>Edit</button>
                        <button onClick={() => openDeleteForm(product.id, product.name)}>Delete</button>
                        </>)}
                    <button onClick={() => openDetailModal(product.id)}>Detail</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit product: </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="p-2 mx-1">
                    <label className="p-2">Name: *</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}/>
                </div>
                <div className="p-2 mx-1">
                    <label className="p-2">Description: *</label>
                    <input type="text" value={productDescription}
                           onChange={(e) => setProductDescription(e.target.value)}/>
                </div>
                <div className="p-2 mx-1">
                    <label className="p-2">Price: *</label>
                    <input type="number" step="0.10" value={productPrice} onChange={(e) => setProductPrice(e.target.value)}/>
                </div>
                <div>
                    {formError && <p className='text-danger'>{formError}</p>}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleCloseEditModal}>
                    Close
                </Button>
                <Button variant="success" onClick={handleEditProduct}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
             <Modal.Header closeButton>
                <Modal.Title>Delete product: </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p> Are you sure that you want delete the product: {selectedProductName} ?</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleCloseDeleteModal}>
                    No
                </Button>
                <Button variant="success" onClick={handleDeleteProduct}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
             <Modal.Header closeButton>
                <Modal.Title>Create a new product:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="p-2 mx-1">
                    <label className="p-2">Name: *</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}/>
                </div>
                <div className="p-2 mx-1">
                    <label className="p-2">Description: *</label>
                    <input type="text" value={productDescription}
                           onChange={(e) => setProductDescription(e.target.value)}/>
                </div>
                <div className="p-2 mx-1">
                    <label className="p-2">Price: *</label>
                    <input type="number" step="0.10" value={productPrice} onChange={(e) => setProductPrice(e.target.value)}/>
                </div>
                <div>
                    {formError && <p className='text-danger'>{formError}</p>}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleCloseCreateModal}>
                    Close
                </Button>
                 <Button variant="success" onClick={handleCreateProduct}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
             <Modal.Header closeButton>
                <Modal.Title>Create a new product:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="p-2 mx-1">
                    <div className="pt-3">
                        <span className="fw-bold mx-2">Id :</span>
                        <span>{selectedProductId}</span>
                    </div>
                    <div className="pt-3">
                        <span className="fw-bold mx-2">Name :</span>
                        <span>{productName}</span>
                    </div>
                    <div className="pt-3">
                        <span className="fw-bold mx-2">Description :</span>
                        <span>{productDescription}</span>
                    </div>
                    <div className="pt-3">
                        <span className="fw-bold mx-2">Price :</span>
                        <span>{productPrice}</span>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleCloseDetailModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  );
};

export default ProductList;
