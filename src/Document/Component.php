<?php

namespace App\Document;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'components')]
class Component
{
    #[ODM\Id]
    #[Groups(['process:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $name;

    #[ODM\ReferenceMany(storeAs: 'dbRef', targetDocument: Component::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Collection $childrenComponents;

    #[ODM\ReferenceMany(storeAs: 'dbRef', targetDocument: Functionality::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Collection $functionalities;

    public function __construct()
    {
        $this->childrenComponents = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): Component
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Component
    {
        $this->name = $name;
        return $this;
    }

    public function getChildrenComponents(): Collection
    {
        return $this->childrenComponents;
    }

    public function addChildComponent(Component $child): Component
    {
        if (!$this->childrenComponents->contains($child))
            $this->childrenComponents->add($child);
        return $this;
    }

    public function removeChildComponent(Component $child): Component
    {
        $this->childrenComponents->removeElement($child);
        return $this;
    }

    public function getFunctionalities(): Collection
    {
        return $this->functionalities;
    }

    public function addFunctionality(Functionality $functionality): Component
    {
        if (!$this->functionalities->contains($functionality))
            $this->functionalities->add($functionality);
        return $this;
    }

    public function removeFunctionality(Functionality $functionality): Component
    {
        $this->functionalities->removeElement($functionality);
        return $this;
    }

}
