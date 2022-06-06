import React, { Component } from 'react';
import axios from 'axios';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
  this.state = ({
    libros: [],
    pos: null,
    titulo2: 'Nuevo',
    id_prestamo: 0,
    titulo: '',
    nombre_usuario: '',
    fec_prestamo: '',
    fec_devolucion: ''
  })
  this.cambioTitulo = this.cambioTitulo.bind(this);
  this.cambioNombre_usuario = this.cambioNombre_usuario.bind(this);
  this.cambioFec_prestamo = this.cambioFec_prestamo.bind(this);
  this.cambioFec_devolucion = this.cambioFec_devolucion.bind(this);
  this.mostrar = this.mostrar.bind(this);
  this.eliminar = this.eliminar.bind(this);
  this.guardar = this.guardar.bind(this);
}
  render() {
    return (
    <div>
      <h1>Lista de Prestamos</h1>
      <table border="1">
      <thead>    
            <tr>
              <th>id_prestamo</th>
              <th>titulo</th>
              <th>Nombre de usuario</th>
              <th>Fecha de prestamo</th>
              <th>Fecha de fec_devolucion</th>
            </tr>
      </thead>
      <tbody>
        {this.state.libros.map( (libro, index) => {
          return (
            <tr key={libro.id_prestamo}>
              <td>{libro.id_prestamo}</td>
              <td>{libro.titulo}</td>
              <td>{libro.nombre_usuario}</td>
              <td>{libro.fec_prestamo}</td>
              <td>{libro.fec_devolucion}</td>
              <td>
                <button onClick={()=>this.mostrar(libro.id, index)}>Editar</button>
                <button onClick={()=>this.eliminar(libro.id)}>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
      </table>
      <hr></hr>
      <h1>{this.state.titulo2}</h1>
      <form onSubmit={this.guardar}>
        <input type="hidden" value={this.state.id_prestamo}/>
        <p>
          Ingrese titulo:
          <input type="text" value={this.state.titulo} onChange={this.cambioTitulo} />
        </p>
        <p>
          Ingrese el Nombre de usuario:
          <input type="text" value={this.state.nombre_usuario} onChange={this.cambioNombre_usuario} />
        </p>
        <p>
          Ingrese la fecha del préstamo:
          <input type="text" value={this.state.fec_prestamo} onChange={this.cambioFec_prestamo} />
        </p>
        <p>
          Ingrese la fecha de la devolución:
          <input type="text" value={this.state.fec_devolucion} onChange={this.cambioFec_devolucion} />
        </p>
        <p><input type="submit" value="Guardar"/></p>
      </form>
    </div>
    )
  }
  componentWillMount() {
    axios.get('http://127.0.0.1:8000/libros/')
    .then(res=>{
      this.setState({ libros: res.data })
    });
  }
  cambioNombre_usuario(e) {
    this.setState( {
      nombre_usuario: e.target.value
    })
  }
  cambioTitulo(e) {
    this.setState( {
      titulo: e.target.value
    })
  }
  cambioFec_prestamo(e) {
    this.setState( {
      fec_prestamo: e.target.value
    })
  }
  cambioFec_devolucion(e) {
    this.setState( {
      fec_devolucion: e.target.value
    })
  }

  mostrar(cod,index) {
    axios.get('http://127.0.0.1:8000/libros/'+cod+'/')
    .then(res=>{
      this.setState({
        pos: index,
        titulo2: 'Editar',
        titulo: res.data.titulo,
        id_prestamo: res.data.id_prestamo,
        nombre_usuario: res.data.nombre_usuario,
        fec_prestamo: res.data.fec_prestamo,
        fec_devolucion: res.data.fec_devolucion,
      })
    });
  }
  guardar(e) {
    e.preventDefault();
    let cod = this.state.id_prestamo;
    let datos = {
      titulo: this.state.titulo,
      nombre_usuario: this.state.nombre_usuario,
      fec_prestamo: this.state.fec_prestamo,
      fec_devolucion: this.state.fec_devolucion,
    }
    if (cod>0) {//Editamos un registro
      axios.put('http://127.0.0.1:8000/libros/'+cod+'/',datos)
      .then(res=>{
        let indx = this.state.pos;
        this.state.libros[indx] = res.data;
        var temp = this.state.libros;
        this.setState( {
          pos: null,
          titulo2: 'Nuevo',
          id_prestamo: 0,
          titulo: '',
          nombre_usuario: '',
          fec_prestamo: '',
          fec_devolucion: '',
          libros: temp
        });
        }).catch(error=>{
          console.log(error.toString());
        });
     }else{ //Nuevo 
      axios.post('http://127.0.0.1:8000/libros/',datos)
      .then(res=> {
        this.state.libros.push(res.data);
        var temp = this.state.libros;
        this.setState( {
          pos: null,
          titulo2: 'Nuevo',
          id_prestamo: 0,
          titulo: '',
          nombre_usuario: '',
          fec_prestamo: '',
          fec_devolucion: '',
          libros: temp
        });
      }).catch(error=>{
        console.log(error.toString());
      });
    }
  }

    eliminar(cod){
      let rpta = window.confirm('¿Está seguro de eliminar?');
      if (rpta) {
        axios.delete('http://127.0.0.1:8000/libros/'+cod+'/')
        .then(res=>{
          var temp = this.state.libros.filter((libro)=>libro.id!==cod);
          this.setState({
            libros: temp
          })
        });
      }
    }
  }
export default App;