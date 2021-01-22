<?php

namespace App\Models;
use Illuminate\Validation\Validator;

/**
 *  Clase de modelo de respuesta de error de API
 * Incluye el posible codigo del error, un mensaje y la excepcion interna que lo produjo
 * Ademas incluye un objeto data que puede contener detalles del error, por ejemplo en caso de error de validación entrega un array con dichos errores
 */
class ErrorResponse
{
   protected $errorCode ;
   protected $message ;
   protected $exceptionMessage;
   protected $data;

   public function __construct(string $msg,int $code=400, string $inner = '', $data = null)
   {
       $this->errorCode = $code;
       $this->message = $msg;
       $this->exceptionMessage = $inner;
       $this->data= $data;
   }

   public function get()
   {
       $obj = [
        'code'=>$this->errorCode,
        'message'=> $this->message,
        'exception'=>$this->exceptionMessage,
        'errorDetail' => $this->data
       ];
       return $obj;
   }
   
   public static function create(string $msg,int $code=400, string $inner = '', $data = null)
   {
        $respuesta = new ErrorResponse($msg,$code,$inner,$data);
        return $respuesta->get();
   }

   public static function fromValidator(Validator $validator)
   {
        $respuesta = new ErrorResponse('Ocurrieron uno o más errores de validación',422,'', $validator->errors());
        return $respuesta->get();
   }
}
