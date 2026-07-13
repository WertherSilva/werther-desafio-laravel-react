<?php

namespace App\Http\Requests;

use App\Enums\ContratoSearchSortBy;
use App\Enums\ContratoStatus;
use App\Enums\SortDirection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ContratoSearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'sort_by'        => $this->filled('sort_by') ? $this->input('sort_by') : ContratoSearchSortBy::DATA_FIM->value,
            'sort_direction' => $this->filled('sort_direction') ? $this->input('sort_direction') : SortDirection::DESC->value,
        ]);
    }

    public function rules(): array
    {
        return [
            'orgao_id'       => ['sometimes', 'nullable', 'integer'],
            'status'         => ['sometimes', 'nullable', 'string', new Enum(ContratoStatus::class)],
            'fornecedor_id'  => ['sometimes', 'nullable', 'integer'],
            'sort_by'        => ['nullable', 'string', new Enum(ContratoSearchSortBy::class)],
            'sort_direction' => ['nullable', 'string', new Enum(SortDirection::class)],
            'per_page'       => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'orgao_id.integer'                                => 'O campo orgao_id deve ser um número inteiro.',
            'status.string'                                   => 'O campo status deve ser uma string.',
            'fornecedor_id.integer'                           => 'O campo fornecedor_id deve ser um número inteiro.',
            'status.Illuminate\Validation\Rules\Enum'         => 'Campo Status inválido.',
            'per_page.required'                               => 'Campo per_page não encontrado.',
            'per_page.integer'                                => 'O campo per_page deve ser um número inteiro.',
            'per_page.min'                                    => 'O campo per_page deve ser maior que 1.',
            'per_page.max'                                    => 'O campo per_page deve ser menor que 100.',
            'sort_by.string'                                  => 'O campo sort_by deve ser uma string.',
            'sort_by.Illuminate\Validation\Rules\Enum'        => 'Campo sort_by inválido.',
            'sort_direction.string'                           => 'O campo sort_direction deve ser uma string.',
            'sort_direction.Illuminate\Validation\Rules\Enum' => 'Campo sort_direction inválido.',
        ];
    }
}