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

    #[ODM\ReferenceOne(storeAs: 'dbRef', targetDocument: Component::class, cascade: ['persist', 'remove'])]
    private ?Component $parent_component;

    #[ODM\ReferenceMany(storeAs: 'dbRef', targetDocument: Component::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Collection $children_components;

    public function __construct()
    {
        $this->children_components = new ArrayCollection();
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

    public function getParentComponent(): ?Component
    {
        return $this->parent_component;
    }

    public function setParentComponent(?Component $parent_component): Component
    {
        $this->parent_component = $parent_component;
        return $this;
    }


    public function getChildrenComponents(): Collection
    {
        return $this->children_components;
    }

    public function setChildrenComponents(Collection $children_components): Component
    {
        $this->children_components = $children_components;
        return $this;
    }

    public function addChildComponent(Component $child): Component
    {
        if (!$this->children_components->contains($child))
            $this->children_components->add($child);
        return $this;
    }

    public function removeChildComponent(Component $child): Component
    {
        $this->children_components->removeElement($child);
        return $this;
    }


}
