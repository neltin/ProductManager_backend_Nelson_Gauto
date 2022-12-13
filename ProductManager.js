const fs = require('fs/promises');
const { existsSync } = require('fs');

class ProductManager {  
    static contId = 0;

    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try{        
            if (existsSync(this.path)) {        
                const listProduct = await fs.readFile(this.path, 'utf-8');

                if(listProduct.length > 0){
                    const data = JSON.parse(listProduct);

                    //Sumar al contador si hay algu dato en el JSON
                    if(data.length > 0){
                        ProductManager.contId = data[data.length -1].id + 1;
                    }

                    return data;

                }else{
                    return  await fs.writeFile( this.path, JSON.stringify( [] , null , '\t') );
                }

            }else{
                return await fs.writeFile( this.path, JSON.stringify( [] , null , '\t') );
            }
        }

        catch(error) {
            throw new Error(`Hubo un error en getProducts => ${error.message}`);
        }        
    }
    
    async addProduct(producto){
        try{ 
            const listProduct = await this.getProducts();
            const c =  listProduct.find(p => p.code === producto.code);
  
            if(c){
                //console.error("El codigo esta repetido");
                throw new Error(`Hubo un error => Se repitio el codigo ${producto.code}`);

            }else{
                const nuevoProducto = {
                    id: ProductManager.contId,
                    ...producto
                }
                
                listProduct.push(nuevoProducto);
                await fs.writeFile( this.path, JSON.stringify( listProduct , null , '\t') );
                
                console.table(nuevoProducto)

            }
        }
        catch(error) {
            throw new Error(`Hubo un error en addProduct => ${error.message}`);
        } 
    }

    async getProductsById(id){
        try{ 
            const listProduct = await this.getProducts();    
            const pId = listProduct.findIndex(p => p.id === id);

            if(pId < 0 ){
                //console.error('El producto no existe o no se encuentra disponible.');
                throw new Error(`Hubo un error => El producto con el ID: ${id} no existe o no se encuentra disponible.`);

            }

            return listProduct[pId];
        }
        catch(error){
            throw new Error(`Hubo un error en getProductById => ${error.message}`);
        }           
    }

    async updateProduct(producto) {
        try{ 
            const listProduct = await this.getProducts();

            const productUpdate = listProduct.filter( p => p.id === producto.id );

            if(productUpdate.length === 1){
                const newListProduct = listProduct.map( (p) => {
                        if(producto.id === p.id){
                            return { ...productUpdate[0], ...producto };
                        }else{
                            return p;
                        }
                    }
                );
                
                await fs.writeFile( this.path, JSON.stringify(newListProduct, null, '\t') )

            }else{
                throw new Error(`Hubo un error => el producto con el ID: ${producto.id} no existe.`);
            }            

        }
        catch(error){
            throw new Error(`Hubo un error en updateProduct => ${error.message}`);
        }
    }

    async deleteProduct(id){
        try{ 
            const listProduct = await this.getProducts();    
            const pId = listProduct.findIndex(p => p.id == id);

            if(pId < 0 ){
                //console.error('El producto no existe o no se encuentra disponible.');
                throw new Error(`Hubo un error => El producto con el ID: ${id} no existe o no se encuentra disponible.`);

            }else{
                const productDelete = listProduct.filter( p => p.id !== id );
                await fs.writeFile(this.path, JSON.stringify(productDelete, null, '\t'));
                
                console.log("productoEliminado", productDelete);
            }
        }
        catch(error){
            throw new Error(`Hubo un error en deleteProduct => ${error.message}`);
        }           
    }

}


//const producto = new ProductManager("./data.json");


//producto.getProducts();

/*
const productoUno = {
    title: "producto prueba", 
    description: "Este es un producto prueba", 
    price: 200 , 
    thumbnail: "Sin imagen", 
    code: "abc123", 
    stock: 25
};
*/


//producto.addProduct(productoUno);

//producto.getProductsById(3);

/*
const productoDos = {
    id: 4,
    title: "Modificado", 
    description: "Producto Modificado", 
    price: 400 , 
    thumbnail: "imagen", 
    code: "werfwepijf", 
    stock: 0
};
*/

//producto.updateProduct(productoDos);

//producto.deleteProduct(2);