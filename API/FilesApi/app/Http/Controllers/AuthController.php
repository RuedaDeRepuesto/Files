<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;
use App\Models\ErrorResponse;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt', ['except' => ['token']]);
    }

    /**
     * Obtener token
     *
     * @return \Illuminate\Http\JsonResponse
     *
     */

    public function token(Request $request)
    {
      $credentials = ['email' => $request->get('user'), 'password' => $request->get('password')];

      try 
      {
            if (! $token = JWTAuth::attempt($credentials)) 
            {
                  return response()->json(ErrorResponse::create('Credenciales invalidas',401,'',$credentials), 400);
            }
      } 
      catch (JWTException $e) 
      {
            return response()->json(ErrorResponse::create('Error al crear el token',500,$e->getMessage(),$e), 500);
      }
        
      $user = auth()->user();
      $rememberToken = bin2hex(openssl_random_pseudo_bytes(32));
      $user->api_remember_token = Hash::make($rememberToken);
      $user->save();
      return $this->tokenResponse($token,$rememberToken);
    }

    

    /**
     * Datos del usuario auth
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Cerrar sesion
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Sesión cerrada!']);
    }
    /**
     * Obtener un nuevo token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->tokenResponse(auth()->refresh(),'');
    }


    protected function tokenResponse($token,$rememberToken)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'remember_token' => $rememberToken,
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user(),
        ]);
    }

}
