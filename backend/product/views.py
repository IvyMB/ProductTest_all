from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
import logging
from product.models import Product
from product.serializers import ProductSerializer


logger = logging.getLogger(__name__)


class ListCreateBaseView(generics.ListCreateAPIView):
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        created_object_id = response.data.get('id', None)
        if created_object_id:
            logger.info(f'{request.user.username} created a new object with ID: {created_object_id}')
        return response


class RetrieveUpdateDestroyBaseView(generics.RetrieveUpdateDestroyAPIView):
    def put(self, request, *args, **kwargs):
        object_id = kwargs.get('pk', None)
        if object_id:
            logger.info(f'{request.user.username} updated a object with ID: {object_id}')
            return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        object_id = kwargs.get('pk', None)
        if object_id:
            logger.info(f'{request.user.username} deleted a object with ID: {object_id}')
            return super().delete(request, *args, **kwargs)


class ProductCreateListView(ListCreateBaseView):
    # Only get and options methods is allowed without authentication token
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductRetrieveUpdateDestroyView(RetrieveUpdateDestroyBaseView):
    # Only get and options methods is allowed without authentication token
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
