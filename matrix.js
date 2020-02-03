//author: Paul Caron


class Matrix{
    constructor(rows, columns){
        this.rows=rows;
        this.columns=columns;
        this.values=new Array(rows*columns);
    }
    setValues(values){
        for(let a=0;a<values.length;a++){
            this.values[a]=values[a];
        }
    }    
    printValues(mat){
        let rowstr = "";
        let index=0;
        for(let a=0;a<this.rows;a++){
            rowstr="";
            for(let b=0;b<this.columns;b++){
                rowstr+=this.values[index++].toFixed(7)+" ";               
            }
            console.log(rowstr);
        }
    }
    resetToNull(){
        for(let a=0;a<this.values.length;a++){
            this.values[a]=0;
        }    
    }
    makeIdentity(){        
        if(this.rows===this.columns){
            this.resetToNull();
            for(let a=0;a<this.rows;a++){
                this.values[a*this.columns+a]=1;
            }
        }
    }
    ///statics
    static add(mat1, mat2){
        if(mat1.rows===mat2.rows&&mat1.columns===mat2.columns){
            let result = new Matrix(mat1.rows, mat1.columns);
            for(let a=0;a<mat1.values.length;a++){
                result.values[a]=mat1.values[a]+mat2.values[a];                
            }          
            return result;
        }
    }
    static kmult(mat,k){
        let result=new Matrix(mat.rows,mat.columns 
        );
        for(let a=0;a<mat.values.length;a++){
            result.values[a]=(mat.values[a]*k);                        
        }
        return result ;
    }
    static mult(mat1,mat2){
        if(mat1.columns===mat2.rows){
            let result= new Matrix(mat1.rows, mat2.columns);
            let index = 0;
            let one=0;
            let two=0;
            for(let h=0;h<mat1.rows;h++){
            for(let i=0;i<mat2.columns;i++){
                result.values[index]=0;
                for(let j=0;j<mat1.columns;j++){
                    one=mat1.values[j+h*mat1.columns];
                    two=mat2.values[j*mat2.columns+i];
                    ;
                    result.values[index] += one * two;               
                }
                index++;
            }
            }            
            return result;           
        }
    }
    static transpose(mat){
        let result=new Matrix(mat.columns,mat.rows);
        for(let index=0;index<mat.values.length;index++){
            result.values[(index%result.rows)*result.columns+parseInt(index/result.rows)]=mat.values[index];        
        }
        return result;
    }
    static inverse(mat){
        if(mat.rows===mat.columns){
            
            if(mat.rows==2){
                let adjugate=new Matrix(mat.rows, mat.columns);
                let a=Matrix.getValueByRC(mat,0,0);
                let b=Matrix.getValueByRC(mat,0,1);
                let c=Matrix.getValueByRC(mat,1,0);
                let d=Matrix.getValueByRC(mat,1,1);
                let det=a*d-b*c;
                adjugate.setValues([d,-b, -c, a]);
                let inverse=Matrix.kmult(adjugate,1/det);
                return inverse;
            }else{
                //get matrix of minors
                let min=Matrix.minors(mat);
                //add cofactors
                Matrix.addCofactors(min);
                //transpose
                let adjugate=Matrix.transpose(min);
                //multiply by determinant
                let det = Matrix.determinant(mat);                              
                let inverse=Matrix.kmult(adjugate,1/det);
                return inverse;
            }            
        }
    }
    static minors(mat){        
        let result=[];               
        if(mat.rows==2&&mat.columns==2){
            let a=Matrix.getValueByRC(mat,0,0);
                let b=Matrix.getValueByRC(mat,0,1);
                let c=Matrix.getValueByRC(mat,1,0);
                let d=Matrix.getValueByRC(mat,1,1);
                let det=a*d-b*c;
            return det;
        }else{
        if(mat.rows===mat.columns){            
            for(let a=0;a<mat.rows;a++){
                for(let b=0;b<mat.columns;b++){
                    let det=Matrix.determinant(Matrix.removeRC(mat,a,b));
                    result.push(det);                
                }
            }
            let min= new Matrix(mat.rows,mat.columns);
            min.setValues(result);
            return min;                        
        }
        }
    }
    static getValueByRC(mat, row, col){
        return mat.values[row*mat.columns + col];
    }
    static setValueByRC(mat,row,col,val){
        mat.values[row*mat.columns + col]=val;
    }
    
    static determinant(mat){
        if(mat.rows==2){
            let a=Matrix.getValueByRC(mat,0,0);
            let b=Matrix.getValueByRC(mat,0,1);
            let c=Matrix.getValueByRC(mat,1,0);
            let d=Matrix.getValueByRC(mat,1,1);
            let det=a*d-b*c;
            return det;
        }else{
            let result=[];
            let mat2= new Matrix(mat.rows-1,mat.columns-1);
            for(let a=0;a<mat.rows;a++){
                for(let b=0;b<mat.columns;b++){
                    result.push(Matrix.removeRC(mat,a,b));
                }
            }                     
            let result2=[];
            for(let r of result){
                let matz=new Matrix(mat.rows-1,mat.columns-1);
                matz.setValues(r.values);
                result2.push(Matrix.determinant(matz));               
            }
            //cofactors
            let det=0;
            let cof=1;
            for(let a=0;a<mat.columns;a++){
                det+=result2[a]*cof*mat.values[a];
                cof*=-1;
            }            
            return det; 
        }
    }
    static removeRC(mat,row,col){
        let result = new Matrix(mat.rows-1,mat.columns-1);
        let index=0;
        for(let a=0;a<mat.rows;a++){
            for(let b=0;b<mat.columns;b++){
                if(a===row||b==col){
                    
                }else{                    
                    result.values[index]=Matrix.getValueByRC(mat,a,b);
                    index++;
                }
            }
        }
        return result;
    }
    static addCofactors(mat){
        for(let a=0;a<mat.rows;a++){
            for(let b=0;b<mat.columns;b++){                
                if((a%2===0&&b%2===1)||(a%2===1&&b%2===0)){
                    let value= Matrix.getValueByRC(mat,a,b);
                    Matrix.setValueByRC(mat,a,b,value*-1);
                }
            }
        }
    }
}//End of the Matrix Class
