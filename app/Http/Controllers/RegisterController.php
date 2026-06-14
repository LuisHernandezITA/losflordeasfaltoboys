<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends ResponseController
{
    public function register(Request $request)
    {
        $messages = [
            'name.required' => 'El nombre es obligatorio.',
            'email.unique' => 'Este correo ya está registrado.',
            'password.same' => 'Las contraseñas no coinciden.',
        ];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'c_password' => 'required|same:password',
        ], $messages);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Error de validación.', 'errors' => $validator->errors()], 422);
        }

        // El modelo User hace el hashing automáticamente por el 'casts' => ['password' => 'hashed']
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, 
        ]);
        
        $success['token'] = $user->createToken('MyApp')->accessToken;
        $success['name'] = $user->name;

        return response()->json(['success' => true, 'message' => '¡Usuario registrado!', 'user' => $success], 200);
    }

    public function login(Request $request)
    {
        // Validar credenciales
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $user = Auth::user();
            $success['token'] = $user->createToken('MyApp')->accessToken;
            $success['name'] = $user->name;
            $success['user_id'] = $user->id;

            return response()->json(['success' => true, 'message' => 'Login exitoso.', 'user' => $success]);
        } else {
            // Verificamos si existe el método en el padre, si no, devolvemos un JSON directo
            if (method_exists($this, 'sendError')) {
                return $this->sendError('Unauthorised.', ['error' => 'Credenciales incorrectas']);
            }
            return response()->json(['success' => false, 'message' => 'Credenciales incorrectas'], 401);
        }
    }
}