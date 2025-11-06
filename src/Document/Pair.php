<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'pairs')]
class Pair
{
    #[ODM\Id]
    #[Groups(['process:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $firstComponentId;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $secondComponentId;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getSecondComponentId(): string
    {
        return $this->secondComponentId;
    }

    public function setSecondComponentId(string $secondComponentId): Pair
    {
        $this->secondComponentId = $secondComponentId;
        return $this;
    }

    public function getFirstComponentId(): string
    {
        return $this->firstComponentId;
    }

    public function setFirstComponentId(string $firstComponentId): Pair
    {
        $this->firstComponentId = $firstComponentId;
        return $this;
    }

}
