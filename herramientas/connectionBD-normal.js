const produccionDB = {
    host: 'academiaglobal.cu1njaiwfxac.us-east-2.rds.amazonaws.com',
    user: 'inventores',
    password: 'UkjUIUJ78jkj7HJG6g',
    database: 'inventores',  
    port: 7887
}

const pruebasDB = {
    host: 'agcollege.edu.mx',
    user: 'sistemas',
    password: 'uCG1lysB9a4PGTkg7qeZ496u5063yHVW',
    database: 'escolar',  
    port: 9876
}

global.connectionapp = mysql.createConnection(pruebasDB);

connectionapp.connect(function(error){
    if(error){
       throw error;
    }else{
       console.log('Conexion correcta BD.');
    }
});