<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

#[ODM\Document(collection: 'collection')]
class Collection
{
    #[ODM\Id]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    private string $first_field;

    #[ODM\Field(type: 'string')]
    private string $second_field;

    #[ODM\Field(type: 'string')]
    private string $third_field;

    #[ODM\Field(type: 'int')]
    private int $fourth_field;

    #[ODM\Field(type: 'collection')]
    private array $fifth_field = [];

    public function getFirstField(): string
    {
        return $this->first_field;
    }

    public function setFirstField(string $first_field): self
    {
        $this->first_field = $first_field;
        return $this;
    }

    public function getSecondField(): string
    {
        return $this->second_field;
    }

    public function setSecondField(string $second_field): self
    {
        $this->second_field = $second_field;
        return $this;
    }

    public function getThirdField(): string
    {
        return $this->third_field;
    }

    public function setThirdField(string $third_field): self
    {
        $this->third_field = $third_field;
        return $this;
    }

    public function getFourthField(): int
    {
        return $this->fourth_field;
    }

    public function setFourthField(int $fourth_field): self
    {
        $this->fourth_field = $fourth_field;
        return $this;
    }

    public function getFifthField(): array
    {
        return $this->fifth_field;
    }

    public function setFifthField(array $fifth_field): self
    {
        $this->fifth_field = $fifth_field;
        return $this;
    }



}
