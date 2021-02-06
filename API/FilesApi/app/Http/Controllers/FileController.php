<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\File;
use App\Models\ErrorResponse;
use Intervention\Image\ImageManagerStatic as Image;

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
     * put()
     */
    public function put(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string',
            'id' => 'required|int'
        ]);

        if($validator->fails())
        {
            return response()->json(ErrorResponse::fromValidator($validator), 422);
        }

        $user_id = auth()->user()->id;
        $file = File::where('id',$request->get('id'))->where('user_id',$user_id)->first();

        $file->filename = $request->get('filename');
        $file->desc = $request->get('desc');
        $file->save();

        return response()->json($file);
    }

    /**
     * post()
     */
    public function post(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file'
        ]);

        if($validator->fails())
        {
            return response()->json(ErrorResponse::fromValidator($validator), 422);
        }

        $user = auth()->user();
        $file = $request->file('file');

        //dd($file->get());

        $fname = $file->getClientOriginalName();
        $ext = $file->getClientOriginalExtension();

        $storedFileName = uniqid().'_'.$fname;  
             
        $request->file->storeAs('archivos', $storedFileName);

        $fileObj = new File();
        $fileObj->filename = $fname;
        $fileObj->extension = $ext;
        $fileObj->desc = '';
        $fileObj->mime = $file->getClientMimeType();
        $fileObj->user_id = $user->id;
        $fileObj->size = $file->getSize();
        $fileObj->file = $storedFileName;
    
        $fileObj->save();

        if(strpos($fileObj->mime,"image") !== false)
        {
            $img = Image::make(storage_path('app/archivos/'.$storedFileName));
            $img->resize(64, 64);
            $img->save(storage_path('app/previews/'.$storedFileName));
        }
        
        
        return response()->json($fileObj);
    }
    

    /***
     * getFile()
     */

    public function getFile(Request $request, int $id)
    {
        $user_id = auth()->user()->id;
        $file = File::where('id',$id)->where('user_id',$user_id)->first();
        $file_path = storage_path('app/archivos/'.$file->file);
        return response()->file($file_path);
    }


    /**
     * delete borrar archivo.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(int $id)
    {
        $user_id = auth()->user()->id;
        $file = File::where('id',$id)->where('user_id',$user_id)->first();
        $name = $file->filename;
        $file->delete();
        return response()->json(['filename' => $name]);
       
    }


    /**
     * GET Preview real stream
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function preview(int $id)
    {
        $user_id = auth()->user()->id;
        $file = File::where('id',$id)->where('user_id',$user_id)->first();
        $file_path = storage_path('app/previews/'.$file->file);
        return response()->file($file_path);
    }

}
