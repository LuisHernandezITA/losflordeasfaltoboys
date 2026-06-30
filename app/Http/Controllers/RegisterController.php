<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class RegisterController extends ResponseController
{
    public function register(Request $request)
{
    // 1. Mensajes personalizados para que el JSON ya vaya directo y limpio
    $messages = [
        'name.required' => 'El nombre de usuario es obligatorio.',
        'name.unique' => 'Este nombre de usuario ya está en uso.',
        'email.required' => 'El correo electrónico es obligatorio.',
        'email.email' => 'Por favor, ingresa un correo válido.',
        'email.unique' => 'Este correo electrónico ya está registrado.',
        'password.required' => 'La contraseña es obligatoria.',
        'c_password.required' => 'Debes confirmar la contraseña.',
        'c_password.same' => 'Las contraseñas no coinciden.',
    ];

    // 2. Agregamos 'unique:users' también al name para evitar duplicados ahí
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255|unique:users',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string',
        'c_password' => 'required|same:password',
    ], $messages);

    // 3. Si falla, mandamos un código 422 estándar con los errores explícitos
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Error de validación.',
            'errors' => $validator->errors()
        ], 422); 
    }

    // 4. Proceso de registro normal si todo pasa limpio
    $input = $request->all();
    $input['password'] = bcrypt($input['password']);
    $user = User::create($input);
    
    $success['token'] = $user->createToken('MyApp')->accessToken;
    $success['name'] = $user->name;

    return response()->json([
        'success' => true,
        'message' => '¡Usuario registrado con éxito!',
        'user' => $success
    ], 200);
}

    public function login(Request $request)
{
    $user_id = $request->input('user_id');

    if ($user_id) {
        
        $user = User::find($user_id);

        if ($user) {
            // AUTH WITH ID
            Auth::loginUsingId($user->id);

            // CREATE TOKEN WITH ID
            $token = $user->createToken('MyApp')->accessToken;

            $success['user_id'] = $user->id;
            $success['token'] = $token;

            return response()->json([
                'success' => true,
                'message' => 'Bienvenido!.',
                'user' => $success
            ]);
        } else {
            return $this->sendError('Usuario no encontrado.', ['error' => 'User not found']);
        }
    } else {
        // AUTH WITH CREDENTIALS
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $user = Auth::user();
            $success['token'] = $user->createToken('MyApp')->accessToken;
            $success['name'] = $user->name;
            $success['user_id'] = $user->id;

            return response()->json([
                'success' => true,
                'message' => 'Bienvenido!.',
                'user' => $success
            ]);
        } else {
            return $this->sendError('No autorizado.', ['error' => 'Unauthorised']);
        }
    }
}

}
