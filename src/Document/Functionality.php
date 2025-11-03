<?php

namespace App\Document;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'functionalities')]
class Functionality
{
    #[ODM\Id]
    #[Groups(['process:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $name;

    #[ODM\ReferenceMany(storeAs: 'dbRef', targetDocument: FunctionalityRequirement::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Collection $requirements;

    public function __construct()
    {
        $this->requirements = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): Functionality
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Functionality
    {
        $this->name = $name;
        return $this;
    }

    public function getRequirements(): Collection
    {
        return $this->requirements;
    }

    public function addRequirement(FunctionalityRequirement $requirement): Functionality
    {
        if(!$this->requirements->contains($requirement)){
            $this->requirements->add($requirement);
        }
        return $this;
    }

    public function removeRequirements(): Functionality
    {
        $this->requirements = new ArrayCollection();
        return $this;
    }

}
