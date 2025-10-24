<?php

namespace App\Document;

use App\Repository\ProcessesRepository;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'processes',repositoryClass: ProcessesRepository::class)]
class Process
{
    #[ODM\Id]
    #[Groups(['process:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $name;

    #[ODM\ReferenceOne(storeAs: 'dbRef', targetDocument: Component::class)]
    #[Groups(['process:read'])]
    private ?Component $component;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): Process
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Process
    {
        $this->name = $name;
        return $this;
    }

    public function getComponent(): ?Component
    {
        return $this->component;
    }

    public function setComponent(?Component $main_component): Process
    {
        $this->component = $main_component;
        return $this;
    }




}
