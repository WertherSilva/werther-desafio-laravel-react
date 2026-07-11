<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrgaoSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'ativo'    => $this->filled('ativo') ? $this->boolean('ativo') : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'busca'    => ['sometimes', 'nullable', 'string', 'max:255'],
            'ativo'    => ['nullable', 'boolean'],
            'per_page' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'ativo.boolean'    => 'O campo ativo deve ser true ou false.',
            'per_page.required' => 'Campo per_page não encontrado.',
            'per_page.integer' => 'O campo per_page deve ser um número inteiro.',
            'per_page.min'     => 'O campo per_page deve ser maior que 1.',
            'per_page.max'     => 'O campo per_page deve ser menor que 100.',
        ];
    }
}