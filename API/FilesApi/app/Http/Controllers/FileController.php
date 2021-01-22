<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\File;
use App\Models\ErrorResponse;

class FileController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt');
    }

    
    /**
     * getAll()
     */
    public function getAll(Request $request)
    {
        $first = 0;
        if($request->get('first'))
        {
            $first = $request->get('first');
        }
        $files = File::where('id','>=',$first)->where('user_id',auth()->user()->id);

        if($request->get('search'))
        {
            $search = $request->get('search');
            $files = $files->where('filename','LIKE',"%{$search}%");
        }

        $files = $files->take(30)
            ->get();
        
        return response()->json($files);
    }

    /**
     * post()
     */
    public function post(Request $request)
    {

    }

}
