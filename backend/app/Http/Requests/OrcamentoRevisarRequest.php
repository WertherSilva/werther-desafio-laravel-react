<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrcamentoRevisarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'observacao_revisao' => $this->filled('observacao_revisao') ? $this->input('observacao_revisao') : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'observacao_revisao' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'observacao_revisao.max' => 'O campo observacao_revisao deve ser menor que 1000.',
        ];
    }
}
